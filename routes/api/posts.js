const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const auth = require('../../middleware/auth');

const Post = require("../../models/Post")
const Profile = require("../../models/Profile")
const User = require("../../models/User")

// @route       POST api/posts
// @desc        Create a post
// @access      private
router.post('/',
    [
        auth,
        [
            check('text', "Text is required")
                .not()
                .isEmpty()
        ]
    ]
    ,
    check('text', "Text is required")
        .not()
        .isEmpty()
    ,
    async (req, res) => {
        const error = validationResult(req)

        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array() })
        }

        try {
            const user = await User.findById(req.user.id).select('-password')

            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            });

            const post = await newPost.save();
            res.json(post)

        } catch (error) {
            console.error(error.message)
            res.status(500).send("Server Error")

        }
    });

// @route       GET api/posts
// @desc        Get All Post
// @access      private
router.get('/', auth, async (req, res) => {
    try {

        const posts = await Post.find().sort({ date: -1 });
        res.json(posts)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server Error")
    }
})

// @route       GET api/posts/:id
// @desc        Get post by id
// @access      private
router.get('/:id', auth, async (req, res) => {
    try {

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: "Post not found" })
        }

        res.json(post)

    } catch (error) {
        console.error(error.message)

        //If user pass object id which do not have any post 
        //Then It Should return this error message
        if (error.kind === "ObjectId") {
            return res.status(404).json({ msg: "Post not found" })
        }
        res.status(500).send("Server Error")
    }
})

// @route       DELETE api/posts/:id
// @desc        Delete a post
// @access      private
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: "Post not found" })
        }

        //Check User
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User Not Authorise' })
        }

        post.remove();

        res.json({ msg: "Post removed" })

    } catch (error) {
        console.error(error.message)

        //If user pass object id which do not have any post 
        //Then It Should return this error message
        if (error.kind === "ObjectId") {
            return res.status(404).json({ msg: "Post not found" })
        }
        res.status(500).send("Server Error")
    }
})

// @route       PUT api/posts/like/:id
// @desc        Like a post
// @access      private
router.put('/like/:id', auth, async (req, res) => {
    try {

        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).json({ msg: "Post not found" })
        }

        //Check if post already have been liked by user
        if (post.likes.filter(like => like.user.toString() == req.user.id).length > 0) {
            return res.status(400).json({ msg: "Post already liked" })
        }

        post.likes.unshift({ user: req.user.id });
        await post.save();
        res.json(post.likes)

    } catch (error) {
        console.error(error.message)

        //If user pass object id which do not have any post 
        //Then It Should return this error message
        if (error.kind === "ObjectId") {
            return res.status(404).json({ msg: "Post not found" })
        }
        res.status(500).send("Server Error")

    }
})

// @route       PUT api/posts/unlike/:id
// @desc        Unlike a post
// @access      private
router.put('/unlike/:id', auth, async (req, res) => {
    try {

        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).json({ msg: "Post not found" })
        }

        //Check if post already have been liked by user
        if (post.likes.filter(like => like.user.toString() == req.user.id).length === 0) {
            return res.status(400).json({ msg: "Post has not yet been liked" })
        }

        //Get removed index
        const removedIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

        post.likes.splice(removedIndex, 1);
        await post.save();
        res.json(post.likes)

    } catch (error) {
        console.error(error.message)

        //If user pass object id which do not have any post 
        //Then It Should return this error message
        if (error.kind === "ObjectId") {
            return res.status(404).json({ msg: "Post not found" })
        }
        res.status(500).send("Server Error")

    }
})

// @route       POST api/posts/comment/:id
// @desc        Comment on a post
// @access      private
router.post(
    '/comment/:id',
    [
        auth,
        [
            check('text', "Text is required")
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array() })
        }

        try {
            const user = await User.findById(req.user.id).select('-password')
            const post = await Post.findById(req.params.id)

            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            };

            post.comments.unshift(newComment)

            await post.save()
            res.json(post.comments)

        } catch (error) {
            console.error(error.message)
            res.status(500).send("Server Error")

        }
    });

// @route       DELETE api/posts/comment/:id/comment_id
// @desc        Comment on a post
// @access      private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        //Pull out comment
        const comment = post.comments.find(
            comment => comment.id === req.params.comment_id
        );

        //Make Sure Commnet Exist
        if (!comment) {
            return res.status(404).json({ msg: "Comment does not exist" })
        }

        //Check user
        if (comment.user.toString() !== req.user.id) {
            return res.send(401).json({ msg: "User not authorise" })
        }

        //Get removed index
        const removedIndex = post.comments
            .map(comment => comment.user.toString())
            .indexOf(req.user.id);

        post.comments.splice(removedIndex, 1)
        await post.save()
        res.json(post.comments)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server Error")
    }
})

module.exports = router;