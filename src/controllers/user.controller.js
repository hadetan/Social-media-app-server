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

            await userToFollow.save();
            await curUser.save();

            return res.send(success(200, 'User unfollowed successfully'));
        } else {
            userToFollow.followers.push(curUserId);
            curUser.followings.push(userIdToFollow);

            await userToFollow.save();
            await curUser.save();

            return res.send(success(200, 'User followed successfully'));
        }
    } catch (error) {
        return res.send(customError(500, error.message));
    }
};

const getPostsOfFollowing = async (req, res) => {
    try {
        const curUserId = req._id;

        const curUser = await User.findById(curUserId);

        const posts = await Post.find({
            owner: {
                $in: curUser.followings,
            },
        });

        return res.send(success(200, posts));
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
        await Post.deleteMany({
            owner: curUserId,
        });

        // Removed this user from followers followings
        curUser.followers.map(async (followerId) => {
            const follower = await User.findById(followerId);
            if (follower) {
                const index = follower.followings.indexOf(curUserId);
                if (index > -1) {
                    follower.followings.splice(index, 1);
                    await follower.save();
                }
            }
        });

        // Remove this user from followings followers
        curUser.followings.map(async (followingId) => {
            const following = await User.findById(followingId);
            if (following) {
                const index = following.followers.indexOf(curUserId);
                if (index > -1) {
                    following.followers.splice(index, 1);
                    await following.save();
                }
            }
        });

        // Remove this user from all likes
        const allPosts = await Post.find();
        allPosts.map(async (post) => {
            const index = post.likes.indexOf(curUserId);
            if (index > -1) {
                post.likes.splice(index, 1);
                await post.save();
            }
        });

        // Delete user
        await curUser.deleteOne();

        // Delete users cookie
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
    getPostsOfFollowing,
    getMyPosts,
    getUserPosts,
    getMyInfo,
    getUserProfile,
    updateUserProfile,
    deleteMyProfile,
};
