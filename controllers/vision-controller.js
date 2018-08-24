const axios = require('axios')

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
				res.send(item.textAnnotations)
			})
		})
		.catch(function (response) {
			console.log(response.data)
		})
	}

}

module.exports = Controller