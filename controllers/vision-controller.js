const axios = require("axios");
const vision = require("../middlewares/vision-logic");
const Storage = require("@google-cloud/storage");
const Multer = require("multer");
const Item = require("../models/item-model");
const EventModel = require("../models/event-model");
const User = require("../models/user-model");
require("dotenv").config();

const CLOUD_BUCKET = process.env.CLOUD_BUCKET;

const storage = Storage({
  projectId: process.env.GCLOUD_PROJECT,
  keyFilename: process.env.KEYFILE_PATH
});

const bucket = storage.bucket(CLOUD_BUCKET);

const getPublicUrl = function(filename) {
  return `https://storage.googleapis.com/${CLOUD_BUCKET}/${filename}`;
};

class Controller {
	static uploadToStorage (req, res, next) {

		// { 	fieldname: 'file',
		// 	originalname: 'indomaret-3.JPG',
		// 	encoding: '7bit',
		// 	mimetype: 'image/jpeg',
		// 	buffer: <Buffer ff d8 ff e1 2f fe 45 78 69 66 00 00 4d 4d 00 2a 00 00 00 08 00 0b 01 0f 00 02 00 00 00 06 00 00 00 92 01 10 00 02 00 00 00 09 00 00 00 98 01 12 00 03 ... >,
		// 	size: 2200732 }

		// res.send(req.file)

		console.log('----------> Upload image started .....')

		// for PRODUCTION case use req.file
		let image = req.file
		// for DEVELOPMENT case using emulator / android device
		// let image = req.body.file

		console.log('passing 0')

		console.log('req.file --> ', req.file)

		// console.log('req ---> ', req)

		// console.log('req.body ---> ', req.body)

		if (!image) {
			return next()
		}

		console.log('passing 1')

		const gcsname = Date.now() + image.originalname
		
		const file = bucket.file(gcsname)
		
		const stream = file.createWriteStream({
			metadata: {
				contentType: image.mimetype
			}
		})
		
		console.log('passing 2')

		stream.on('error', (err) => {
			image.cloudStorageError = err
			next(err)
		})

		console.log('passing 3')
		
		stream.on('finish', () => {
			image.cloudStorageObject = gcsname
			file.makePublic().then(() => {
				image.cloudStoragePublicUrl = getPublicUrl(gcsname)
				next()
			})
		})
		
		console.log('passing 4')
		
		stream.end(image.buffer)
		console.log('upload end')
		console.log('Url link hasil upload : ', image.cloudStoragePublicUrl)
		console.log('upload ended, buffer: ', image.buffer)
	}

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
}

const multer = Multer({
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

module.exports = { Controller, multer };
