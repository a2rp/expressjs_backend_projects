const express = require("express");

const {
    getUsers,
    updateUserPermissions,
    updateUserRole,
    updateUserStatus,
} = require("../controllers/admin.controllers");

const { requireAuth } = require("../middlewares/auth.middleware");

const { allowRoles } = require("../middlewares/authorization.middleware");

const router = express.Router();

// Every admin route requires authentication first.
router.use(requireAuth);

// Only users with the admin role can access routes below.
router.use(allowRoles("admin"));

// List all users with their current roles, permissions, and status.
router.get("/users", getUsers);

// Change a user's role.
router.patch("/users/:userId/role", updateUserRole);

// Replace a user's permission list.
router.patch("/users/:userId/permissions", updateUserPermissions);

// Activate or deactivate a user account.
router.patch("/users/:userId/status", updateUserStatus);

module.exports = router;
