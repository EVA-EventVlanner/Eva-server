const axios = require('axios')
const vision = require('../middlewares/vision-logic')

class Controller {
	static analyze (req, res, next) {
		let uri = 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDJX04YZhWWFxICsIF2u0E3t9f93sYnjqA'
		let receipt = req.body.image_url

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
			
			response.data.responses.map( item => {

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

module.exports = Controller