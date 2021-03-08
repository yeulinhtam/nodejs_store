const productRouter = require('./product');
const userRoute = require('./user');

function route(app) {
    app.use('/products',productRouter),
    app.use('/users',userRoute)
}

module.exports = route;