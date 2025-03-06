"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECRET_KEY = exports.AuthMiddleWare = void 0;
const AppError_model_1 = require("../models/AppError.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let SECRET_KEY = 'MY SECRET KEY SHHHHHHH';
exports.SECRET_KEY = SECRET_KEY;
const AuthMiddleWare = ((req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] ?? '';
    if (!token) {
        next(new AppError_model_1.AppError('You are not logged in', 401));
    }
    jsonwebtoken_1.default.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            next(new AppError_model_1.AppError('You are not logged in', 401));
        }
        req.headers['current_user'] = decoded;
        next();
    });
});
exports.AuthMiddleWare = AuthMiddleWare;
