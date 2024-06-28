const { success, customError } = require('../utils/responseWrapper');
const Post = require('../models/Post.schema');
const User = require('../models/User.schema');
const cloudinary = require('cloudinary').v2;

const createPostController = async (req, res) => {
    try {
        const { caption, postImg } = req.body;

        if (!caption || !postImg) {
            return res.send(customError(400, 'Caption and Image are required'));
        }

        const cloudImg = await cloudinary.uploader.upload(postImg, {
            folder: 'postImg',
        });

        const owner = req._id;

        const user = await User.findById(owner);

        const post = await Post.create({
            owner,
            caption,
            image: {
                publicId: cloudImg.public_id,
                url: cloudImg.url,
            },
        });

        await user.posts.push(post._id);
        await user.save();

        return res.send(success(201, post));
    } catch (error) {
        return res.send(customError(500, error.message));
    }
};

const likeAndUnlikePostController = async (req, res) => {
    try {
        const { postId } = req.body;
        const curUserId = req._id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.send(customError(404, 'Post not found'));
        }

        if (post.likes.includes(curUserId)) {
            const index = post.likes.indexOf(curUserId);
            post.likes.splice(index, 1);

            await post.save();
            return res.send(success(200, 'Post unliked successfully'));
        } else {
            post.likes.push(curUserId);
            await post.save();
            return res.send(success(200, 'Post liked successfully'));
        }
    } catch (error) {
        return res.send(customError(500, error.message));
    }
};

const updatePostController = async (req, res) => {
    try {
        const { postId, caption } = req.body;
        const curUserId = req._id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.send(customError(404, 'Post not found'));
        }

        if (post.owner.toString() !== curUserId) {
            return res.send(
                customError(403, 'Only post owners can update their posts')
            );
        }

        if (caption) {
            post.caption = caption;
        }

        await post.save();

        return res.send(success(201, { post }));
    } catch (error) {
        return res.send(customError(500, error.message));
    }
};

const deletePostController = async (req, res) => {
    try {
        const { postId } = req.body;
        const curUserId = req._id;

        const post = await Post.findById(postId);
        const curUser = await User.findById(curUserId);
        if (!post) {
            return res.send(customError(404, 'Post not found'));
        }

        if (post.owner.toString() !== curUserId) {
            return res.send(
                customError(403, 'Only post owners can delete their posts')
            );
        }

        const index = curUser.posts.indexOf(postId);
        curUser.posts.splice(index, 1);

        await curUser.save();
        await post.deleteOne();

        return res.send(success(200, 'Post deleted successfully'));
    } catch (error) {
        return res.send(500, error.message);
    }
};

module.exports = {
    createPostController,
    likeAndUnlikePostController,
    updatePostController,
    deletePostController,
};
