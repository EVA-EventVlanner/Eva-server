class middlewares {
    static getItems (res) {
        var threshold = 10; // threshold for y coordinate (line) just in case image is skewed. 
        
        // this is used for identifying each block of text are in the same line.
        var thresholdXPct = 20; // threshold for x coordinate - just in case the result is a skewed box

        var sentencePushStart = false;
        let beforeTotalWord = false;

        let items = []
		let receiptTotal = 0


        // console.log("Start Detection...");

			var line = -1
			var sentences = []
			var sentencesBounds = []
			var s = "";
            var endx = 0 
            var endXMin
            var endXMax 
            var startx = 0
            var startxcount = 0
            var startXMax

			// 1. define farthest right x coordinate
			for(var i in res){
                if(i == 0) continue
                
                var bounds = res[i].boundingPoly.vertices

                // Get the farthest right x coordinate
                endx = Math.max(endx,Math.max(res[i].boundingPoly.vertices[1].x,res[i].boundingPoly.vertices[3].x))
			}

            // Calculate threshold for x
			endXMin = endx - thresholdXPct*endx/100
		
			// 2. construct sentence line by line.
            var lastbounds
            
			for(var i in res) {
                if(i == 0) continue
                
                var bounds = res[i].boundingPoly.vertices

				var thisavg = ( bounds[2].y + bounds[3].y ) / 2
                
                if (line < 0) {
                    line = thisavg 
                }

				// Check if the middle of the 'word' is within the line threshold
				if (Math.abs(thisavg - line) <= threshold) {
                    s += " " + res[i].description
				}
				else {
                    var avgendx = (lastbounds[1].x+lastbounds[3].x)/2
                    
                    if(avgendx >= endXMin) { // assume a new line, pushing the old sentence to the list.
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
			startXMax = startx+thresholdXPct*startx/100
			var result = []
			
			// 3. getting the 'last price' - from the rightest part of sentence and traverse to the left.
			
			// console.log('sentences', sentences)
			
			for(var j in sentences) {
				var sr = sentences[j].split(" ")
				// console.log("--> setence is ",sentences[j])
				// console.log("---->sr is ",sr)
				
				var numCandidate = ""
				var checkBefore = true

				// going from right to left
				for (var iBack= sr.length; iBack--; iBack <=0 ) {
				var word = sr[iBack].trim()
				
				// google vision 'cuts' word by space (?), so sometime we see the amount 2, 000 is cut into 
				// 2 words, need to join this into a number.
				if (word.startsWith(',') || word.startsWith('.')) {  
					word = word.replace(/,/g,"")
					var num = Number(word)
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
                    var num = Number(word)
                    
					if (!num) {
						// console.log('------>stop at word: '+word)
						break // end -- not an number
					} else {
						numCandidate = word+numCandidate
						// console.log('------> numCandidate is: ', numCandidate);
						checkBefore = false
						continue
					}
				} else if (checkBefore) {
					word = word.replace(/,/g,"");
					var num = Number(word);
                    
                    if (!num) {
						// console.log('------>stop at word: '+word)
						break // end -- not an number
					} else {
						numCandidate = word+numCandidate
						// console.log('------> numCandidate is: ', numCandidate)
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
					if (wordToCompare === 'total' || wordToCompare === 'amount' || wordToCompare === 'total:' || wordToCompare === 'amount:') {
					receiptTotal = numCandidate
					}
				}

				// Handle Receipt Indomaret to push Every Items Purchased

				// console.log("------>candidate is ",numCandidate)

				let anyDate = false
				let anyUnrelevantWord = false

				for (let i = 0; i < sr.length; i++) {
					let dateChecker = sr[i].charAt(2) + sr[i].charAt(5)+ sr[i].charAt(8) + sr[i].charAt(11)
					if (dateChecker === '..-:') {
						sentencePushStart = true
						anyDate = true
						// console.log('------------------------>  found date')
					}

					if (sr[i].toLowerCase().includes('diskon')) {
                        anyUnrelevantWord = true
					} else if (sr[i].toLowerCase().includes('harga')) {
                        anyUnrelevantWord = true
					}

					if (sr[i].toLowerCase().includes('total')) {
                        beforeTotalWord = true
					}
				}

				if (sentencePushStart === true && anyDate === false && anyUnrelevantWord === false && beforeTotalWord === false) {
                    items.push({
                        sr,
                        num: numCandidate
				})
				}

				// 4. construct the result. return is list of number and bounds (last word bounds).
				// bounds are needed to 'highlight' the part in the UI
				var num = Number(numCandidate)
                
                if (!num || num < 100) {
                    if (result.length == 0 || num < 100)
                        continue
				}  else {
                    result.push ({ 
                        'number': Number(numCandidate),
                        'bounds': sentencesBounds[j]
                        })
				}
			}

			// result = { 'textDetectionResult': result };

			// console.log("result ",JSON.stringify(result));
			// console.log("End Detection...");
			// console.log('Receipt total is : ', receiptTotal)
            
            let output = { receiptTotal, items }
            
            return output
    }
}

module.exports = middlewares