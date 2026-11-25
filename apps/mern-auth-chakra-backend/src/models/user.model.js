// User model with hashed passwords and sensible validation
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const emailRegex = /^\S+@\S+\.\S+$/;

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters"],
            maxlength: [60, "Name must be at most 60 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true, // creates a unique index; no separate schema.index here
            lowercase: true,
            trim: true,
            maxlength: [254, "Email must be at most 254 characters"],
            match: [emailRegex, "Please provide a valid email"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters"],
            select: false, // exclude by default
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
    },
    {
        timestamps: true,
        toJSON: {
            // keep responses clean
            transform(_doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.password;
                delete ret.__v;
                return ret;
            },
        },
        toObject: { virtuals: true },
    }
);

// hash password on create or when changed
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

// also cover findOneAndUpdate({ password: ... })
userSchema.pre("findOneAndUpdate", async function () {
    const update = this.getUpdate();
    if (!update) return;

    const newPwd = update.password || (update.$set && update.$set.password);
    if (!newPwd) return;

    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(newPwd, salt);

    if (update.password) update.password = hash;
    if (update.$set && update.$set.password) update.$set.password = hash;

});

// method to compare raw vs hashed
userSchema.methods.comparePassword = function (candidate) {
    return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("User", userSchema);
