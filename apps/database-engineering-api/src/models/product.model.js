const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100,
            index: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
            minlength: 5,
            maxlength: 500,
        },

        category: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50,
            index: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
            index: true,
        },

        inStock: {
            type: Boolean,
            required: true,
            default: true,
            index: true,
        },

        deletedAt: {
            type: Date,
            default: null,
            index: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

// This compound index supports common active-product filtering and sorting.
productSchema.index({
    category: 1,
    price: 1,
    deletedAt: 1,
});

// This text index enables efficient search across product name and description.
productSchema.index({
    name: "text",
    description: "text",
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
