const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const allowedRoles = ["user", "moderator", "admin"];

const allowedPermissions = [
    "resource:read",
    "resource:create",
    "resource:update",
    "resource:delete",
    "user:manage",
];

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required."],
            trim: true,
            minlength: [2, "Name must be at least 2 characters."],
            maxlength: [100, "Name cannot exceed 100 characters."],
        },

        email: {
            type: String,
            required: [true, "Email is required."],
            trim: true,
            lowercase: true,
            unique: true,
            index: true,
        },

        // Password is hidden from normal queries by default.
        password: {
            type: String,
            required: [true, "Password is required."],
            minlength: [8, "Password must be at least 8 characters."],
            select: false,
        },

        // Role provides broad access control.
        role: {
            type: String,
            enum: allowedRoles,
            default: "user",
            index: true,
        },

        // Permissions allow more specific authorization rules.
        permissions: {
            type: [
                {
                    type: String,
                    enum: allowedPermissions,
                },
            ],
            default: [],
        },

        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

// Normalize email before validation and persistence.
userSchema.pre("validate", function () {
    if (this.email) {
        this.email = this.email.trim().toLowerCase();
    }
});

// Hash the password only when it is created or changed.
userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    const saltRounds = 12;

    this.password = await bcrypt.hash(this.password, saltRounds);
});

// Compare a login password with the stored hash.
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Return a safe representation of the user.
userSchema.methods.toJSON = function () {
    const user = this.toObject();

    delete user.password;

    return user;
};

const User = mongoose.model("User", userSchema);

module.exports = {
    User,
    allowedPermissions,
    allowedRoles,
};
