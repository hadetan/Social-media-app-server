const asyncHandler = require("../utils/asyncHandler");

const getAllPosts = asyncHandler(async (req, res) => {
    return res.json({
        message: 'These are all the posts',
    });
})

module.exports = {
    getAllPosts,
};
