const Customer = require("../models/customer.model");

module.exports.createNewCustomer = async (req, res) => {
    try {
        const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";

        if (name.length < 3 || name.length > 120) {
            return res.status(400).json({
                success: false,
                message: "Customer name must be between 3 and 120 characters.",
            });
        }

        const customer = await Customer.create({ name, addedBy: req.user });
        return res.status(201).json({
            success: true,
            message: "Customer created successfully.",
            customer,
        });
    } catch (error) {
        console.error("Customer create failed:", error.name || "Error");
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

module.exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find({ addedBy: req.user })
            .sort({ createdAt: -1 })
            .limit(100)
            .lean();

        return res.json({ success: true, customers, limit: 100 });
    } catch (error) {
        console.error("Customer list failed:", error.name || "Error");
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};
