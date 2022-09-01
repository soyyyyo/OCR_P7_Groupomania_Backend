const express = require('express');
const app = express();


const bodyParser = require('body-parser');
const mongoSanitize = require('express-mongo-sanitize');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(mongoSanitize());

module.exports = (req, res, next) => {
    // const inputUser = req.body.userId // define the super admin user shit thingy
    app.use(
        mongoSanitize({
            onSanitize: ({ req, key }) => {
                console.log(`This request[${key}] is sanitized`, req);
            },
        }),
    );

};