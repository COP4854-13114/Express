"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_model_1 = require("../models/user.model");
const AppError_model_1 = require("../models/AppError.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userRouter = express_1.default.Router();
let arrayUsers = [];
userRouter.post('/', (req, res, next) => {
    console.log(req.body);
    bcrypt_1.default.hash(req.body.password, 10, (err, hash) => {
        console.log(hash);
        console.log(err);
        if (err) {
            next(new AppError_model_1.AppError('Error in hashing password', 500));
        }
        const user = new user_model_1.BlogUser(req.body.username, hash);
        arrayUsers.push(user);
        console.log(arrayUsers);
        res.status(201).json(user);
    });
});
userRouter.get('/login/:username/:password', (req, res, next) => {
    let user = undefined;
    for (let x of arrayUsers) {
        if (x.username === req.params.username) {
            bcrypt_1.default.compare(req.params.password, x.password, (err, result) => {
                if (err) {
                    next(new AppError_model_1.AppError('Invalid Username or Password', 401));
                }
                if (result) {
                    res.status(200).json({
                        "success": "You are logged in!",
                        "user": x
                    });
                }
                else {
                    next(new AppError_model_1.AppError('Invalid Username or Password', 401));
                }
            });
            user = x;
            break;
        }
    }
});
exports.default = userRouter;
