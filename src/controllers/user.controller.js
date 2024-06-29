const User = require('../models/User.schema');
const Post = require('../models/Post.schema');
const { customError, success } = require('../utils/responseWrapper');
const { mapPostOutput } = require('../utils/utils');
const cloudinary = require('cloudinary').v2;

const followOrUnfollowUserController = async (req, res) => {
    try {
        const { userIdToFollow } = req.body;
        const curUserId = req._id;

        const userToFollow = await User.findById(userIdToFollow);
        const curUser = await User.findById(curUserId);

        if (curUserId === userIdToFollow) {
            return res.send(customError(409, 'Users cannot follow themselves'));
        }

        if (!userToFollow) {
            return res.send(customError(404, 'User not found to follow'));
        }

        if (curUser.followings.includes(userIdToFollow)) {
            const followingIndex = curUser.followings.indexOf(userIdToFollow);
            curUser.followings.splice(followingIndex, 1);

            const followerIndex = userToFollow.followers.indexOf(curUser);
            userToFollow.followers.splice(followerIndex, 1);
        } else {
            userToFollow.followers.push(curUserId);
            curUser.followings.push(userIdToFollow);
        }

        await userToFollow.save();
        await curUser.save();

        return res.send(success(200, { user: userToFollow }));
    } catch (error) {
        return res.send(customError(500, error.message));
    }
};

const getFeedData = async (req, res) => {
    try {
        const curUserId = req._id;

        const curUser = await User.findById(curUserId).populate('followings');

        const allPosts = await Post.find({
            owner: {
                $in: curUser.followings,
            },
        }).populate('owner');

        const posts = allPosts
            .map((item) => mapPostOutput(item, req._id))
            .reverse();

        const followingsId = curUser.followings.map((item) => item._id);
        followingsId.push(req._id);

        const suggestions = await User.find({
            _id: {
                $nin: followingsId,
            },
        });

        return res.send(success(200, { ...curUser._doc, suggestions, posts }));
    } catch (error) {
        return res.send(customError(500, error.message));
    }
};

const getMyPosts = async (req, res) => {
    try {
        const curUser = req._id;

        const myAllPosts = await Post.find({
            owner: curUser,
        }).populate('likes');

        return res.send(success(200, { myAllPosts }));
    } catch (error) {
        return res.send(customError(500, error.message));
    }
};

const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.send(customError(400, 'User ID is required'));
        }

        if (!userId) {
            return res.send(customError(404, 'User not found'));
        }

        const userAllPosts = await Post.find({
            owner: userId,
        }).populate('likes');

        return res.send(success(200, { userAllPosts }));
    } catch (error) {
        return res.send(customError(500, error.message));
    }
};

const getMyInfo = async (req, res) => {
    try {
        const user = await User.findById(req._id);
        return res.send(success(200, { user }));
    } catch (error) {
        return res.send(customError(500, error.message));
    }
};

const getUserProfile = async (req, res) => {
    try {
        const userId = req.body.userId;

        const user = await User.findById(userId).populate({
            path: 'posts',
            populate: {
                path: 'owner',
            },
        });

        if (!user) {
            return res.send(customError(404, 'User not found'));
        }

        const allPosts = user.posts;

        const posts = allPosts
            .map((item) => mapPostOutput(item, req._id))
            .reverse();

        return res.send(success(200, { ...user._doc, posts }));
    } catch (error) {
        console.log(error);
        return res.send(customError(500, error.message));
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const { name, bio, userImg } = req.body;

        const user = await User.findById(req._id);

        if (name) {
            user.name = name;
        }

        if (bio) {
            user.bio = bio;
        }

        if (userImg) {
            const cloudImg = await cloudinary.uploader.upload(userImg, {
                folder: 'profileImg',
            });
            user.avatar = {
                url: cloudImg.secure_url,
                publicId: cloudImg.public_id,
            };
        }

        await user.save();
        return res.send(success(200, { user }));
    } catch (error) {
        return res.send(customError(500, error.message));
    }
};

const deleteMyProfile = async (req, res) => {
    try {
        const curUserId = req._id;
        const curUser = await User.findById(curUserId);

        if (!curUser) {
            return res.send(customError(404, 'User not found'));
        }

        // Delete all posts from this user
        await Post.deleteMany({ owner: curUserId });

        // Remove this user from followers' followings
        for (const followerId of curUser.followers) {
            await User.updateOne(
                { _id: followerId },
                { $pull: { followings: curUserId } }
            );
        }

        // Remove this user from followings' followers
        for (const followingId of curUser.followings) {
            await User.updateOne(
                { _id: followingId },
                { $pull: { followers: curUserId } }
            );
        }

        // Remove this user from all likes
        const allPosts = await Post.find();
        for (const post of allPosts) {
            if (post.likes.includes(curUserId)) {
                await Post.updateOne(
                    { _id: post._id },
                    { $pull: { likes: curUserId } }
                );
            }
        }

        // Delete user
        await curUser.deleteOne();

        // Delete user's cookie
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true,
        });

        return res.send(success(200, 'User deleted successfully'));
    } catch (error) {
        return res.send(customError(500, error.message));
    }
};

module.exports = {
    followOrUnfollowUserController,
    getFeedData,
    getMyPosts,
    getUserPosts,
    getMyInfo,
    getUserProfile,
    updateUserProfile,
    deleteMyProfile,
};
