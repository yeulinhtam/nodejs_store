const mongoose = require('mongoose');

const Product = require('./../models/Product');
const User = require('./../models/User');
const Comment = require('./../models/Comment');


class ProductController {

    index(req, res, next) {

        // var page = parseInt(req.query.page) || 1;
        // var limit = parseInt(req.query.limit) || 8;
        // var order = req.query.order;
        // var query = {};
        // var sort = {};

        // if (req.query.sort) {
        //     const str = req.query.sort.split(':')
        //     sort[str[0]] = str[1] === 'desc' ? -1 : 1
        // }


        // Product.find(query)
        //     .sort(sort)
        //     .skip(page * limit - limit)
        //     .limit(limit)
        //     .exec((err, doc) => {
        //         if (err) {
        //             return res.json(err);
        //         }
        //         Product.countDocuments(query).exec((count_error, count) => {
        //             if (err) {
        //                 return res.json(count_error);
        //             }
        //             return res.json(
        //                 {
        //                     data: {
        //                         total: count,
        //                         page: page,
        //                         limit: limit,
        //                         sort: sort,
        //                         order: order,
        //                         data: doc,
        //                     }
        //                 });
        //         });
        //     });
        var page = parseInt(req.query.page) || 1;
        var limit = parseInt(req.query.limit) || 8;

        const keyword = req.query.keyword ? {
                name: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            } : {};


        const sort = req.query.sort ? req.query.sort === 'lowest' ? { price: 1 } : { price: -1 } : { _id: -1 };

        Product.find({ ...keyword })
            .sort(sort)
            .skip(page * limit - limit)
            .limit(limit)
            .exec((err, doc) => {
                if (err) {
                    return res.json(err);
                }
                Product.count({...keyword}).exec((count_error, count) => {
                    if (err) {
                        return res.json(count_error);
                    }
                    return res.json(
                        {
                            data: {
                                total: count,
                                page: page,
                                limit: limit,
                                data: doc,
                            }
                        });
                });
            });
    }



    crete(req, res, next) {
        res.render('product-create');
    }


    store(req, res, next) {

        const formData = req.body;
        formData.image = req.file.filename;
        formData.price = Number(formData.price.replace(/[^0-9.-]+/g, ""));

        if (!formData.active) {
            formData.active = false;
        } else {
            formData.active = true;
        }

        const product = new Product(formData);
        product.save().then(
            () => res.redirect('/products')
        ).catch(
            (err) => res.send(err)
        )
    }

    show(req, res, next) {
        Product.findOne({ slug: req.params.slug })
            .then((product) => {
                const jsonData = {
                    "data": product
                }
                res.json(jsonData)
            }).catch(next);
    }

    edit(req, res, id) {
        res.send("ok edit")
    }


    sort(query) {

        var sort_by = req.query.sort_by || null;
        var order = req.query.order || null;
        var query = {};

        Product.find(query)
            .sort({ price: -1 })
            .skip(page * limit - limit)
            .limit(limit)
            .exec((err, doc) => {
                if (err) {
                    return res.json(err);
                }
                Product.countDocuments(query).exec((count_error, count) => {
                    if (err) {
                        return res.json(count_error);
                    }
                    return res.json({
                        total: count,
                        page: page,
                        limit: limit,
                        data: doc
                    });
                });
            });
    }

    async postReview(req, res, next) {

        try {
            const product = await Product.findOne({ slug: req.params.slug }).populate('comments.user', 'image fullname').exec();
            if (!product) {
                res.status(401).json({
                    message: 'Product not found'
                });
            }
            const comment = {
                user: req.body._id,
                content: req.body.comment
            };
            product.comments.push(comment);
            const updateProduct = await product.save();

            const lastComment = updateProduct.comments[updateProduct.comments.length - 1];
            const _idUser = lastComment.user;
            const user = await User.findOne({ _id: _idUser }).exec();
           
            return res.json({
                message: 'Post comment success',
                data: {
                    _id: lastComment._id,
                    user: {
                        _id: user._id,
                        image: user.image
                    },
                    content: lastComment.content,
                    createdAt: lastComment.createdAt,
                    updatedAt: lastComment.updatedAt
                }
            })
        } catch (err) {
            return res.json({
                messages: err
            })
        }
    }

    async getReviews(req, res, next) {
        const product = await Product.findOne({ slug: req.params.slug }).populate('comments.user', 'image fullname').exec();
        return res.json({
            data: product.comments
        })
    }
}


module.exports = new ProductController;

