const axios = require("axios");
const vision = require("../middlewares/vision-logic");
require("dotenv").config();

class Controller {
  static async analyze(req, res, next) {
    console.log("----------> Analyze image started .....");

    let uri = `https://vision.googleapis.com/v1/images:annotate?key=${
      process.env.VISION_API_KEY
    }`;

    let image = req.file;

    let receipt = image.cloudStoragePublicUrl;

    console.log("cloudstoragepublicurl : ", receipt);

    try {
      const response = await axios.post(uri, {
        requests: [
          {
            features: [
              {
                type: "TEXT_DETECTION"
              }
            ],
            image: {
              source: {
                imageUri: receipt
              }
            }
          }
        ]
      });

      response.data.responses.map(item => {
        let result = vision.getItems(item.textAnnotations);
        res.status(200).json({
          result
        });
      });
    } catch (e) {
      // statements
      console.log(e);
      res.json({
        e
      });
    }
  }

  static async analyzeWithLink(req, res, next) {
    console.log("----------> Analyze image started .....");

    let uri = `https://vision.googleapis.com/v1/images:annotate?key=${
      process.env.VISION_API_KEY
    }`;

    let receiptUrl = [
      { type: "transport", url: "https://i.imgur.com/VxTJoGG.jpg" },
      { type: "needs", url: "https://i.imgur.com/PDOqZvm.jpg" }
    ];

    let receipt = "";

    // if (req.body.image_url) {
    //   receipt = req.body.image_url;
    //   console.log("receipt url : ", receipt);
    // } else
    
    if (req.body.type === "transport") {
      receipt = receiptUrl[0].url;
      console.log("receipt url transport : ", receipt);
    } else {
      receipt = receiptUrl[1].url;
      console.log("receipt url needs : ", receipt);
    }

    try {
      const response = await axios.post(uri, {
        requests: [
          {
            features: [
              {
                type: "TEXT_DETECTION"
              }
            ],
            image: {
              source: {
                imageUri: receipt
              }
            }
          }
        ]
      });

      response.data.responses.map(item => {
        let result = vision.getItems(item.textAnnotations);
        res.status(200).json({
          result
        });
      });
    } catch (e) {
      // statements
      console.log(e);
      res.json({
        e
      });
    }
  }
}

module.exports = Controller;
