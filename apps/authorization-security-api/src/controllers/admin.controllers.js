const {
    User,
    allowedPermissions,
    allowedRoles,
} = require("../models/user.model");

// List users so an admin can review current roles, permissions, and status.
const getUsers = async (req, res, next) => {
    try {
        const users = await User.find()
            .sort({
                createdAt: -1,
            })
            .lean();

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully.",
            data: users,
        });
    } catch (error) {
        return next(error);
    }
};

// Update a user's role while restricting values to the model's allowed roles.
const updateUserRole = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const { role } = req.body;

        if (typeof role !== "string" || !allowedRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: `Role must be one of: ${allowedRoles.join(", ")}.`,
            });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            {
                role,
            },
            {
                returnDocument: "after",
                runValidators: true,
            },
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User role updated successfully.",
            data: {
                user,
            },
        });
    } catch (error) {
        return next(error);
    }
};

// Replace the user's permission list with a validated set of permissions.
const updateUserPermissions = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const { permissions } = req.body;

        if (!Array.isArray(permissions)) {
            return res.status(400).json({
                success: false,
                message: "permissions must be an array.",
            });
        }

        const uniquePermissions = [...new Set(permissions)];

        const invalidPermissions = uniquePermissions.filter(
            (permission) => !allowedPermissions.includes(permission),
        );

        if (invalidPermissions.length > 0) {
            return res.status(400).json({
                success: false,
                message: "One or more permissions are invalid.",
                invalidPermissions,
                allowedPermissions,
            });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            {
                permissions: uniquePermissions,
            },
            {
                returnDocument: "after",
                runValidators: true,
            },
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User permissions updated successfully.",
            data: {
                user,
            },
        });
    } catch (error) {
        return next(error);
    }
};

// Activate or deactivate a user account without deleting the user document.
const updateUserStatus = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const { isActive } = req.body;

        if (typeof isActive !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isActive must be either true or false.",
            });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            {
                isActive,
            },
            {
                returnDocument: "after",
                runValidators: true,
            },
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: `User ${
                isActive ? "activated" : "deactivated"
            } successfully.`,
            data: {
                user,
            },
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getUsers,
    updateUserPermissions,
    updateUserRole,
    updateUserStatus,
};
