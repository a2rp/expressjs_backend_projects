const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, minlength: 3, maxlength: 120 },
    addedBy: { type: String, required: true, index: true },
}, { timestamps: true });

const Customer = mongoose.model("customer", customerSchema);

module.exports = Customer;

