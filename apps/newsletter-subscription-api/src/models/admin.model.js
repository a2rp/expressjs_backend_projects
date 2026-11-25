const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
    {
        setupSlot: {
            type: String,
            default: "initial-admin",
            immutable: true,
            select: false,
        },
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            maxlength: 254,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false,
        },
    },
    {
        timestamps: true,
    },
);

// The database, rather than a check-then-create request sequence, enforces the single-admin limit.
adminSchema.index(
    { setupSlot: 1 },
    {
        unique: true,
        partialFilterExpression: { setupSlot: { $exists: true } },
        name: "one_initial_admin",
    },
);

adminSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

adminSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
