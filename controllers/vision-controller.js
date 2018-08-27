const axios = require("axios");
const vision = require("../middlewares/vision-logic");
// const Item = require("../models/item-model");
// const EventModel = require("../models/event-model");
// const User = require("../models/user-model");
require("dotenv").config();

class Controller {
	static async analyze (req, res, next) {
		console.log('----------> Analyze image started .....')

		let uri = `https://vision.googleapis.com/v1/images:annotate?key=${process.env.VISION_API_KEY}`

		// for PRODUCTION case use req.file
		let image = req.file
		// for DEVELOPMENT case using emulator / android device
		// let image = req.body.file

		// let receipt = req.body.image_url  // manual request usinig insomnia/ postman
		let receipt = image.cloudStoragePublicUrl

		console.log('cloudstoragepublicurl : ', receipt)

		try {
			const response = await axios.post(uri, {
				"requests": [
					{
						"features": [
							{
							"type": "TEXT_DETECTION"
							}
						],
						"image": {
							"source": {
							"imageUri": receipt
							}
						}
					}
				]
			})

			response.data.responses.map(item=> {
				let result = vision.getItems(item.textAnnotations)
				res.status(200).json({
					result
				})
			})
		} catch(e) {
			// statements
			console.log(e);
			res.json({
				e
			})
		}
	}

	static downloadToServer (req, res, next) {
		let fs = require('fs')
		let request = require('request');

		let fileName = 'receipt' + Date.now() + '.jpg'
		
		let download = function(uri, filename, callback){
			request.head(uri, function(err, res, body){
				console.log('content-type:', res.headers['content-type']);
				console.log('content-length:', res.headers['content-length']);

				request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
			})
		}

		download(req.body.image_url, fileName, function() {
			console.log('done');
			res.json({message: 'image download done'})
		})
		// let axios = require('axios')

		// axios.get('https://firebasestorage.googleapis.com/v0/b/burogu-desu.appspot.com/o/receipt%2F1535275956074indomaret.jpg?alt=media&token=1e652fe6-6108-4db8-9faf-e0d5c4ff0313')
		// .then (response => 
		// 	res.json({response: response})
		// )
		// .catch(err => {
		// 	res.json({ error: err.message})
		// })
	}
}

module.exports = Controller
