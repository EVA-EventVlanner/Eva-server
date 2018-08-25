const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let debtSchema = Schema(
  {
    eventName: { type: Schema.Types.ObjectId, ref: "event" },
    userInDebt: { type: Schema.Types.ObjectId, ref: "user" },
    debt: Number
  },
  { timestamp: true }
);

let debts = mongoose.model("user", debtSchema);

module.exports = debts;
