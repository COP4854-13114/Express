"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_model_1 = require("../models/post.model");
const AppError_model_1 = require("../models/AppError.model");
const router = express_1.default.Router();
let posts = [];
router.post('/', (req, res, next) => {
    if (req.body.title && req.body.content) {
        let post = new post_model_1.BlogPost(req.body.title, req.body.content);
        posts.push(post);
        console.log(posts);
        res.status(201).json(post);
    }
    else {
        next(new AppError_model_1.AppError('Title and Content Are Rquired', 400));
    }
});
router.get('/', (req, res, next) => {
    res.status(200).json(posts);
});
router.get('/Basic', (req, res, next) => {
    //res.json(posts);
    let htmlResponse = '';
    for (let post of posts) {
        htmlResponse += `<h2>${post.title}</h2><p>${post.content}</p><hr/>`;
    }
    res.send(htmlResponse);
});
router.get('/Pug', (req, res, next) => {
    res.render('posts', { postArray: posts });
});
router.get('/ejs', (req, res, next) => {
    res.render('posts.ejs', { postArray: posts });
});
router.get('/hbs', (req, res, next) => {
    res.render('posts', { postArray: posts });
});
exports.default = router;
