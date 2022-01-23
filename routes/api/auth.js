const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs")
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const jwt = require('jsonwebtoken');
const config = require("config")
const { check, validationResult } = require('express-validator/check')

// @route       GET api/auth
// @desc        Test Route
// @access      public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }

});

// @route       POST api/auth
// @desc        Authenticate User & Get token
// @access      public
router.post(
    '/',
    [
        check('email', "{lease Inlcude Valide Email Addreess").isEmail(),
        check('password', "Password Is Required").not().isEmpty()
    ],
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array() })
        }

        const { email, password } = req.body;

        try {
            //see if user exist
            let user = await User.findOne({ email })

            if (!user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: "Invalid Credentials" }] })
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: "Invalid Credentials" }] })
            }


            //Return jsonwebtoken
            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 36000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token })
                });

        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }


    });


module.exports = router