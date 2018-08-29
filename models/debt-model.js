const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let debtSchema = Schema(
  {
    eventName: { type: Schema.Types.ObjectId, ref: "event" },
    userInDebt: { type: Schema.Types.ObjectId, ref: "user" },
    itemName: { type: Schema.Types.ObjectId, ref: "item" },
    debt: Number
  },
  { timestamp: true }
);

let debts = mongoose.model("debt", debtSchema);

module.exports = debts;
