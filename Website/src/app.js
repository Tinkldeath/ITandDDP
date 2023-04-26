const express = require("express");
const cors = require('cors');
const parser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const multer = require('multer');

const app = express();

// Routers
const authRouter = require('./routers/auth');
const portalRouter = require('./routers/portal');
const postsRouter = require('./routers/posts');
const categoriesRouter = require('./routers/categories');
const authorsRouter = require('./routers/authors');
const imagesRouter = require('./routers/images');

// Uses
app.use(cors());
app.use(parser.urlencoded({extended: true}));
app.use(parser.json());
app.use(express.static(path.resolve('src/frontend/public')));
app.use(cookieParser());

// Routes
app.use('/', authRouter);
app.use('/', portalRouter);
app.use('/api', postsRouter);
app.use('/api', categoriesRouter);
app.use('/api', authorsRouter);
app.use('/api', imagesRouter);

app.use((error, req, res, next) => {
    const message = `This is unexpected field ${error.field}`
    console.log(message);
    res.status(500).send(message);
});

module.exports = app;