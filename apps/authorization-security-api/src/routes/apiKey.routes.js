const express = require("express");

const {
    getApiKeyResource,
    getServiceInfo,
} = require("../controllers/apiKey.controllers");

const { requireApiKey } = require("../middlewares/apiKey.middleware");

const router = express.Router();

// Every route in this module requires a valid x-api-key header.
router.use(requireApiKey);

// Demonstrate access to a resource protected only by an API key.
router.get("/resource", getApiKeyResource);

// Return service information to trusted API-key clients.
router.get("/service-info", getServiceInfo);

module.exports = router;
