const parsePositiveId = require("../utils/parsePositiveId");

const users = [
    { id: 1, name: "User 1" },
    { id: 2, name: "User 2" },
];

const getAllUsers = (req, res) => {
    res.json({
        message: "All users fetched successfully",
        data: users,
    });
};

const getUserById = (req, res) => {
    const id = parsePositiveId(req.params.id);

    if (id === null) {
        return res.status(400).json({
            message: "User id must be a positive integer.",
        });
    }

    const user = users.find((item) => item.id === id);

    if (!user) {
        return res.status(404).json({
            message: "User not found",
        });
    }

    res.json({
        message: "Single user fetched successfully",
        data: user,
    });
};

module.exports = {
    getAllUsers,
    getUserById,
};
