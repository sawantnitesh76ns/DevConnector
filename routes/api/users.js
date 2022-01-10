const express = require('express');
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require("config")

const { check, validationResult } = require('express-validator/check')

//Model
const User = require("../../models/User")

// @route       POST api/users
// @desc        Resister User
// @access      public
router.post(
    '/', 
    [
        check('name',  "Name Is Required").not().isEmpty(),
        check('email', "{lease Inlcude Valide Email Addreess").isEmail(),
        check('password',"Please Entere Password With 8 or more character").isLength({ min: 6 })
    ],
    async (req, res) => {
        const error = validationResult(req);
        if(!error.isEmpty()) {
            return res.status(400).json({ error: error.array() })
        }
        
        const { name , email , password } = req.body;
        
        try {
            //see if user exist
            let user = await User.findOne({ email })

            if(user) {
                return res.status(400).json({ error: [{ msg: "User Already exist" }]})
            }

            //Get Users Gravatar

            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            })

            user = new User({
                name, 
                email, 
                avatar, 
                password
            });

            //Encrypt Password 
            const salt = await bcrypt.genSalt(10)
            
            user.password = await bcrypt.hash(password, salt)

            await user.save()


            //Return jsonwebtoken
            const payload = {
                user: {
                    id: user.id
                }
            }
            
            jwt.sign(
                payload, 
                config.get('jwtSecret'),
                { expiresIn: 36000},
                (err, token) => {
                    if(err) throw err;
                    res.json({ token })
                });
            
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }

        
    });

module.exports = router;