import express, {Request,Response,ErrorRequestHandler,NextFunction} from 'express';
import { AppError } from '../models/AppError.model';
import jwt from 'jsonwebtoken';

let SECRET_KEY='MY SECRET KEY SHHHHHHH';

const AuthMiddleWare = ((req:Request,res:Response,next:NextFunction)=>{
    const token = req.headers.authorization?.split(' ')[1] ?? '';
    if(!token)
    {
        next(new AppError('You are not logged in',401));
    }
    jwt.verify(token,SECRET_KEY,(err:any,decoded:any)=>{
        if(err)
        {
            next(new AppError('You are not logged in', 401));
        }
        req.headers['current_user'] = decoded;
        next();
    })

    
});


export {AuthMiddleWare,SECRET_KEY};