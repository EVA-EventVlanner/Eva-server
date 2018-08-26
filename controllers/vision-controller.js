const axios = require('axios')
const vision = require('../middlewares/vision-logic')
const Storage = require('@google-cloud/storage')
const Multer = require('multer')
require('dotenv').config()

const CLOUD_BUCKET = process.env.CLOUD_BUCKET

const storage = Storage({
	projectId: process.env.GCLOUD_PROJECT,
	keyFilename: process.env.KEYFILE_PATH
})

const bucket = storage.bucket(CLOUD_BUCKET)

const getPublicUrl = function (filename) {
	return `https://storage.googleapis.com/${CLOUD_BUCKET}/${filename}`
}

class Controller {

	static uploadToStorage (req, res, next) {
		
		if (!req.file) {
			return next()
		}
		
		const gcsname = Date.now() + req.file.originalname
		const file = bucket.file(gcsname)
		
		const stream = file.createWriteStream({
			metadata: {
				contentType: req.file.mimetype
			}
		})
		
		stream.on('error', (err) => {
			req.file.cloudStorageError = err
			next(err)
		})
		
		stream.on('finish', () => {
			req.file.cloudStorageObject = gcsname
			file.makePublic().then(() => {
				req.file.cloudStoragePublicUrl = getPublicUrl(gcsname)
				next()
			})
		})
		
		stream.end(req.file.buffer)
	}

	static analyze (req, res, next) {
		let uri = 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDJX04YZhWWFxICsIF2u0E3t9f93sYnjqA'
		let receipt = req.body.image_url

		console.log(receipt)

		axios.post(uri, 
		{
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
		} )
		.then(function (response) {
			console.log(response.data.responses)
			// res.send('ok')
			response.data.responses.map( item => {
				// res.send(item.textAnnotations)
				
				let result = vision.getItems(item.textAnnotations)
				res.send(result)
				
			})
		})
		.catch(function (response) {
			res.status(500)

			console.log(response)
		})
	}

}

const multer = Multer({
	storage: Multer.MemoryStorage,
	limits: {
		fileSize: 5 * 1024 * 1024
	}
})

module.exports = { Controller, multer }