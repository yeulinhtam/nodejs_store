const bcrypt = require('bcryptjs');
const authModule = require('./../utills/index');

const User = require('./../models/User');


class UserController {
    index(req, res, next) {
        res.send({
            messages: 'login success!'
        })
    }

    async create(req, res, next) {
        try {
            const { email, password, confirmPassword, fullname } = req.body;
            const existEmail = await User.findOne({ email: email }).exec();
            if (existEmail) {
                res.status(409).send({
                    message: 'A user with this email address aleready exits'
                })
            } else {
                if (password !== confirmPassword) {
                    res.status(403).send({
                        message: 'Confirm password not true'
                    })
                }
                const user = new User({
                    email: email,
                    password: bcrypt.hashSync(password),
                    fullname: fullname,
                    image: null
                })
                user.save().then(() => {
                    res.json({
                        data: {
                            _id: user._id,
                            email: user.email,
                            fullname: user.fullname,
                            image: user.image,
                            accessToken: authModule.generateToken(user),
                        }
                    })
                })
            }

        } catch (err) {
            (err) => res.status(500).send({
                messages: err
            })
        }
    }

    async login(req, res, next) {

        try {
            const { email, password } = req.body.data;
            const user = await User.findOne({ email: email }).exec();

            if (user) {

                var passwordIsValid = bcrypt.compareSync(password, user.password)

                if (!passwordIsValid) {
                    res.status(401).send({
                        message: 'Invalid Password!'
                    })
                }

                var token = authModule.generateToken(user);
                res.status(200).send({
                    data: {
                        _id: user._id,
                        email: user.email,
                        fullname: user.fullname,
                        accessToken: token,
                        image: user.image
                    }
                })
            } else {
                res.status(404).send({
                    message: 'Email not found!'
                })
            }
        } catch (err) {
            res.status(500).send({
                message: err
            })
        }
    }

    async upload(req, res, next){
        try {
            const user = await User.findOne({_id: req.params.id}).exec();
            if (user) {
                user.image = req.file.filename;
                const updateUser = await user.save();
                res.status(201).send({
                    data: {
                        image: updateUser.image,
                    },
                    message: 'Post image successfully'
                });
            } else {
                res.status(404).send({ message: 'Product not found!' });
            }

        } catch (err) {
            res.status(401).send({message: err})
        }
    }
}


module.exports = new UserController;