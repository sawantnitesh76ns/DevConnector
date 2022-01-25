const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator/check')
const request = require("request")
const config = require("config")

const Profile = require('../../models/Profile')
const User = require('../../models/User');
const { route } = require('express/lib/router');

// @route       GET api/profile/me
// @desc        Get profile based on user id
// @access      private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user',
            ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' })
        }

        res.json(profile)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server Error')
    }
})

// @route       POST api/profile
// @desc        Create or update a User profile
// @access      private
router.post('/', [auth, [
    check('status', 'status is required').not().isEmpty(),
    check('skills', 'skills is required').not().isEmpty()
]],
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array() })
        }

        // destructure the request
        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            twitter,
            instagram,
            linkedin,
            facebook,
            // spread the rest of the fields we don't need to check
            ...rest
        } = req.body;




        const profileFields = {}
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;


        if (skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim());
        }

        profileFields.social = {}
        if (youtube) profileFields.youtube = youtube;
        if (twitter) profileFields.twitter = twitter;
        if (facebook) profileFields.facebook = facebook;
        if (linkedin) profileFields.linkedin = linkedin;
        if (instagram) profileFields.instagram = instagram;


        try {
            let profile = await Profile.findOne({ user: req.user.id });
            if (profile) {
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                );

                return res.json(profile)
            }

            //Create New Profile
            profile = new Profile(profileFields);

            await profile.save();
            res.json({ profile })

        } catch (error) {
            res.status(500).send("Server Error")
        }

    }

)

// @route       GET api/profile
// @desc        Get All Profile profile
// @access      public
router.get('/', async (req, res) => {
    try {
        const profile = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profile);
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server Error')
    }
})

// @route       GET api/profile/user/user_id
// @desc        Get Profile by user id
// @access      public
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id
        }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({ message: "Profile Not Found" })
        }
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        if (error.kind == "ObjectId") {
            return res.status(400).json({ message: "Profile Not Found" })
        }
        res.status(500).send('Server Error')
    }
})

// @route       DELETE api/profile
// @desc        Delete profile, user & posts
// @access      private
router.delete('/', auth, async (req, res) => {
    try {
        //@todo - remove user posts

        //Remove profile 
        await Profile.findOneAndRemove({ user: req.user_id });
        //Remove User
        await Profile.findOneAndRemove({ _id: req.user_id });

        res.json({ msg: 'User Deleted' });
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server Error')
    }
})

// @route       PUT api/profile/experience
// @desc        Add profile experience
// @access      private
router.put('/experience', [auth, [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'company is required').not().isEmpty(),
    check('from', 'From Date is required').not().isEmpty()
]],
    async (req, res) => {
        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array() })
        }
        console.log(req.body)

        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }

        try {
            const profile = await Profile.findOne({ user: req.user.id });
            profile.experience.unshift(newExp);
            await profile.save();
            console.log(profile)
            res.json(profile);


        } catch (error) {
            console.error(error.message)
            res.status(500).send('Server Error')

        }

    })

// @route       DELETE api/profile/experience/experience_id
// @desc        Delete profile experience
// @access      private
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        //Get Remove index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id)

        profile.experience.splice(removeIndex, 1);

        await profile.save();
        res.json(profile)

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }

})

// @route       PUT api/profile/education
// @desc        Add profile education
// @access      private
router.put('/education', [auth, [
    check('school', 'school is required').not().isEmpty(),
    check('degree', 'degree is required').not().isEmpty(),
    check('fieldofstudy', 'fieldofstudy is required').not().isEmpty(),
    check('from', 'From Date is required').not().isEmpty()
]],
    async (req, res) => {
        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() })
        }

        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            description
        } = req.body;

        const newEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            description
        }

        try {
            const profile = await Profile.findOne({ user: req.user.id });
            profile.education.unshift(newEdu);
            await profile.save();
            res.json(profile);


        } catch (error) {
            console.error(error.message)
            res.status(500).send('Server Error')

        }

    })

// @route       DELETE api/profile/education/:edu_id
// @desc        Delete profile education
// @access      private
router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        //Get Remove index
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id)

        profile.education.splice(removeIndex, 1);

        await profile.save();
        res.json(profile)

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }

})

// @route       GET api/profile/github/:username
// @desc        Get User Repose form giyhub
// @access      public
router.get('/github/:username', (req, res) => {
    try {
        const option = {
            uri: `https://api.github.com/users/${req.params.username}/repos?
            per_page=5&sort=created:asc&client_id=${config.get("githubClientId")}&client_secret=${config.get("clientSecret")}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
        };

        request(option, (error, response, body) => {
            if (error) console.error(error);

            if (response.statusCode !== 200) {
                return res.status(404).json({ msg: 'No Github Profile Found' });
            }

            res.json(JSON.parse(body));
        })

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
})
module.exports = router;