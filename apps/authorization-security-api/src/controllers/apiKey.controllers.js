// Return a protected response after the API key middleware
// has already validated the incoming x-api-key header.
const getApiKeyResource = async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "API key protected resource accessed successfully.",
        data: {
            resource: "api-key-resource",
            authentication: "x-api-key",
        },
    });
};

// Return basic service information for trusted API-key clients.
const getServiceInfo = async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Trusted service information fetched successfully.",
        data: {
            service: "authorization-security-api",
            version: "1.0.0",
            accessType: "api-key",
            timestamp: new Date().toISOString(),
        },
    });
};

module.exports = {
    getApiKeyResource,
    getServiceInfo,
};
