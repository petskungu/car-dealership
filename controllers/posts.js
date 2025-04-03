const ErrorResponse = require('../utils/errorResponse');
const Post = require('../models/Post');

// @desc    Get all posts
// @route   GET /api/v1/posts
// @access  Public
exports.getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().populate({
            path: 'author',
            select: 'name'
        }).sort('-createdAt');

        res.status(200).json({
            success: true,
            count: posts.length,
            data: posts
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single post
// @route   GET /api/v1/posts/:id
// @access  Public
exports.getPost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id).populate({
            path: 'author',
            select: 'name'
        });

        if (!post) {
            return next(
                new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
            );
        }

        res.status(200).json({
            success: true,
            data: post
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new post
// @route   POST /api/v1/posts
// @access  Private/Admin
exports.createPost = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.author = req.user.id;

        const post = await Post.create(req.body);

        res.status(201).json({
            success: true,
            data: post
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update post
// @route   PUT /api/v1/posts/:id
// @access  Private/Admin
exports.updatePost = async (req, res, next) => {
    try {
        let post = await Post.findById(req.params.id);

        if (!post) {
            return next(
                new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
            );
        }

        // Make sure user is post author or admin
        if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(
                new ErrorResponse(`User not authorized to update this post`, 401)
            );
        }

        post = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: post
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete post
// @route   DELETE /api/v1/posts/:id
// @access  Private/Admin
exports.deletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return next(
                new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
            );
        }

        // Make sure user is post author or admin
        if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(
                new ErrorResponse(`User not authorized to delete this post`, 401)
            );
        }

        await post.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};