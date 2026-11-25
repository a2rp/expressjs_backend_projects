const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        maxlength: 254,
        unique: true,
    },
    password: { type: String, required: true, select: false },
}, { timestamps: true });

const User = mongoose.model("user", userSchema);

module.exports = User;

