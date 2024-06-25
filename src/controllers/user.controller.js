const User = require('../models/User.schema');
const Post = require('../models/Post.schema');
const { customError, success } = require('../utils/responseWrapper');

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
            'owner': {
                '$in': curUser.followings,
            },
        });

        return res.send(success(200, posts));
    } catch (error) {
        return res.send(customError(500, error.message));
    }
};

module.exports = {
    followOrUnfollowUserController,
    getPostsOfFollowing,
    // getMyPosts
    // getUserPosts
    // deleteMyProfile
};
