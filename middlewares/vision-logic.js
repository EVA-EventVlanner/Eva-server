class middlewares {
    static getItems (res) {
        // this is used for identifying each block of text are in the same line.
        let threshold = 10; // threshold for y coordinate (line) just in case image is skewed. 
        let thresholdXPct = 20; // threshold for x coordinate - just in case the result is a skewed box

        let sentencePushStart = false;
        let beforeTotalWord = false;

        let items = []
		let receiptTotal = 0
		let receiptDate = ''

        console.log("------->    Start Detection...");

			let line = -1
			let sentences = []
			let sentencesBounds = []
			let s = "";
            let endx = 0 
            let endXMin
            let endXMax 
            let startx = 0
            let startxcount = 0
            let startXMax

			// 1. define farthest right x coordinate
			for(let i in res){
                if(i == 0) continue
                
                let bounds = res[i].boundingPoly.vertices

                // Get the farthest right x coordinate
                endx = Math.max(endx, Math.max(bounds[1].x, bounds[3].x))
			}

            // Calculate threshold for x
			endXMin = endx - thresholdXPct*endx/100
		
			// 2. construct sentence line by line.
            let lastbounds
            
			for(let i in res) {
                if(i == 0) continue
                
                let bounds = res[i].boundingPoly.vertices

				let thisavg = ( bounds[2].y + bounds[3].y ) / 2
                
                if (line < 0) {
                    line = thisavg 
                }

				// Check if the middle of the 'word' is within the line threshold
				if (Math.abs(thisavg - line) <= threshold) {
                    s += " " + res[i].description
				}
				else {
                    let avgendx = (lastbounds[1].x + lastbounds[3].x)/2
                    
                    if (avgendx >= endXMin) { // assume a new line, pushing the old sentence to the list.
                        sentences.push(s)
                        sentencesBounds.push(bounds)
                    }
                    
                    s = res[i].description
                    startx += bounds[0].x
                    startxcount++
                }
                
				line = thisavg
				lastbounds = bounds
			} 

			startx /= startxcount
			startXMax = startx + thresholdXPct * startx / 100
			
			// 3. getting the 'last price' - from the rightest part of sentence and traverse to the left.

			// console.log('-------> sentences : ', sentences)

			for(let j in sentences) {
				let sr = sentences[j].split(" ")

				// console.log("--> sentence is ",sentences[j])
				// console.log("---->sr is ",sr)
				
				let numCandidate = ""
				let checkBefore = true

				// going from right to left
				for (let iBack = sr.length; iBack--; iBack <=0 ) {
					let word = sr[iBack].trim()
				
					// google vision 'cuts' word by space (?), so sometime we see the amount 2, 000 is cut into 
					// 2 words, need to join this into a number.
					if (word.startsWith(',') || word.startsWith('.')) {  
						word = word.replace(/,/g,"")
						let num = Number(word)
						if (!num) {
							// console.log('------>stop at word: '+word)
							break // end -- not an umber;
						} else {
							numCandidate = word+numCandidate;
							// console.log('------> numCandidate is: ', numCandidate);
							checkBefore = true;
							continue
						}

					} else if (word.endsWith(',') || word.endsWith('.')) {
						word = word.replace(/,/g,"")
						let num = Number(word)
						
						if (!num) {
							// console.log('------>stop at word: '+word)
							break // end -- not an number
						} else {
							numCandidate = word+numCandidate
							console.log('------> numCandidate is: ', numCandidate);
							checkBefore = false
							continue
						}
					} else if (checkBefore) {
						word = word.replace(/,/g,"");
						let num = Number(word);
						
						if (!num) {
							// console.log('------>stop at word: '+word)
							break // end -- not an number
						} else {
							numCandidate = word+numCandidate
							console.log('------> numCandidate is: ', numCandidate)
							checkBefore = false
							continue
						}
					} else {
						// console.log('------>stop at word: '+word)
						break
					}
				}
			
				// get total amount of purchased on receipt
				for (let i = 0; i < sr.length; i++) {
					let wordToCompare = sr[i].toLowerCase()

					if (wordToCompare === 'tota' || wordToCompare === 'total' || wordToCompare === 'amount' || wordToCompare === 'total:' || wordToCompare === 'amount:') {
						receiptTotal = numCandidate
					}
				}

				// Handle Receipt Indomaret to push Every Items Purchased
				// console.log("------>candidate is ",numCandidate)

				let anyDate = false
				let anyUnrelevantWord = false

				for (let i = 0; i < sr.length; i++) {
					
					let dateCheckerIndomaret = sr[i].charAt(2) + sr[i].charAt(5)+ sr[i].charAt(8) + sr[i].charAt(11)
					let dateCheckerPertamina = sr[i].charAt(2) + sr[i].charAt(5)

					if (dateCheckerIndomaret === '..-:' || dateCheckerPertamina === '//') {
						sentencePushStart = true
						anyDate = true
						receiptDate = sr[i]
						// console.log('------------------------>  found date')
					}

					if (sr[i].toLowerCase().includes('diskon') || sr[i].toLowerCase().includes('harga')) {
						anyUnrelevantWord = true
					}

					if (sr[i].toLowerCase().includes('tota')) {
						beforeTotalWord = true
					}
				}

				if (sentencePushStart === true && anyDate === false && anyUnrelevantWord === false && beforeTotalWord === false) {
					let curatedsr = sr.splice(0, sr.length - 2)

					let itemQty = 0
					let srQty = Number(curatedsr[curatedsr.length - 1])

					var hundred = /^[1-9][0-9]?$|^100$/
					let qtyTest = hundred.test(srQty)

					if (qtyTest) {
						itemQty = srQty
					}

						items.push({
							item : curatedsr.join(" "),
							number: Number(numCandidate),
							quantity: itemQty
						})

				}
			}

			let output = { receiptDate, receiptItems: items, receiptTotal: Number(receiptTotal) }

			console.log('Output to client : ', output)

			return output
    }
}

module.exports = middlewares