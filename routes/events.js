const express = require("express");
const router = express.Router();
const Controller = require("../controllers/event-controller");
/* GET users listing. */
router.get("/", Controller.getAllEvent);
router.get("/:eventId", Controller.getEventById);
router.get("/item/:itemId", Controller.getOneItem);

router.post("/", Controller.createEvent);
router.post("/:eventId/item", Controller.createItemForEvent);
router.post("/:eventId/login/:userId", Controller.loginEvent);
router.post(
  "/:eventId/nopassword/:userId",
  Controller.loginEventWithoutPassword
);
router.post("/:eventId/item/:itemId/buy/:userId", Controller.verifyingItem);

router.delete("/delete/:eventId", Controller.deleteEvent);
router.delete(
  "/:eventId/item/:itemId/delete/:index",
  Controller.deleteItemFromEvent
);

module.exports = router;
