const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
            maxlength: [254, "Email cannot exceed 254 characters."],
        },

        // Password is excluded from normal queries for safer defaults.
        password: {
            type: String,
            required: [true, "Password is required."],
            minlength: [8, "Password must be at least 8 characters."],
            select: false,
        },

        // Verification state controls whether the email has been confirmed.
        isEmailVerified: {
            type: Boolean,
            default: false,
        },

        // Only hashed verification tokens are stored in the database.
        emailVerificationToken: {
            type: String,
            default: null,
            select: false,
        },

        emailVerificationExpiresAt: {
            type: Date,
            default: null,
            select: false,
        },

        // Only hashed password-reset tokens are persisted.
        passwordResetToken: {
            type: String,
            default: null,
            select: false,
        },

        passwordResetExpiresAt: {
            type: Date,
            default: null,
            select: false,
        },

        // Refresh tokens are stored as hashes rather than raw JWT values.
        refreshTokenHash: {
            type: String,
            default: null,
            select: false,
        },

        refreshTokenExpiresAt: {
            type: Date,
            default: null,
            select: false,
        },

        // This timestamp can be used to invalidate older authentication tokens.
        passwordChangedAt: {
            type: Date,
            default: null,
        },

        // Incremented to invalidate access tokens issued by older sessions.
        authVersion: {
            type: Number,
            default: 0,
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

// Hash a new or changed password before storing the user document.
userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    const saltRounds = 12;

    this.password = await bcrypt.hash(this.password, saltRounds);
});

// Compare a plain-text login password against the stored password hash.
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Return a safe representation when a user document is serialized.
userSchema.methods.toJSON = function () {
    const user = this.toObject();

    delete user.password;
    delete user.emailVerificationToken;
    delete user.emailVerificationExpiresAt;
    delete user.passwordResetToken;
    delete user.passwordResetExpiresAt;
    delete user.refreshTokenHash;
    delete user.refreshTokenExpiresAt;
    delete user.authVersion;

    return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
