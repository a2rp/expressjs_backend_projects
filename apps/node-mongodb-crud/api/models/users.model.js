const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 80
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        maxlength: 254,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        maxlength: 25,
        match: /^\+?[0-9().\s-]{7,25}$/
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model("User", userSchema);
