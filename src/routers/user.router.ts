import express from 'express';
import { BlogUser } from '../models/user.model';
import { AppError } from '../models/AppError.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const userRouter = express.Router();
let arrayUsers: BlogUser[]=[];
let SECRET_KEY='MY SECRET KEY SHHHHHHH';
const prismaC = new PrismaClient();

userRouter.post('/',async (req,res,next)=>{

    const hash = await bcrypt.hash(req.body.password,10);
    
    const newUser = await prismaC.blogUser.create({
        data:{
            username: req.body.username,
            password: hash
        }
    });
    
    res.status(201).json(newUser);
    
    /*
    bcrypt.hash(req.body.password,10,async (err,hash)=>{
        console.log(hash);
        console.log(err);
        if(err)
        {
            next(new AppError('Error in hashing password',500));
        }
        

        const newUser = await prismaC.blogUser.create({
            data:{
                username: req.body.username,
                password: hash
            }
        });
        res.status(201).json(newUser);
    });*/
    
    
});
userRouter.get('/login/:username/:password', async (req,res,next)=>{
    const user = await prismaC.blogUser.findUnique({
        where: {
            username: req.params.username
        }
    });
    if(user)
    {
        const result = await bcrypt.compare(req.params.password, user.password);
        if(result)
        {
            
            jwt.sign({userId:user.username},SECRET_KEY,{expiresIn:'1h'},(err,token)=>{
                if(err)
                {
                    next(new AppError('Invalid username or password',401));
                }
                res.status(200).json({
                    token:token
                });
            });
        }
    }
    else
    {
        next(new AppError('Invalid username or password',401));
    }
});

userRouter.get('/login_old/:username/:password', (req,res,next)=>{
    let user = undefined;
    for(let u of arrayUsers)
    {
        if(u.username===req.params.username)
        {
            user=u;
            break;
        }
    }
    if(user===undefined)
    {
        next(new AppError('Invalid username or password',401));
    }
    else
    {
        bcrypt.compare(req.params.password,user.password,(err,result)=>{
            if(err)
            {
                next(new AppError('Invalid username or password',401));
            }
            if(result)
            {
                /*res.status(200).json({
                    "success":"You are logged in!",
                    "user":user
                });*/
                jwt.sign({userId:user.username},SECRET_KEY,{expiresIn:'1h'},(err,token)=>{
                    if(err)
                    {
                        next(new AppError('Invalid username or password',401));
                    }
                    res.status(200).json({
                        token:token
                    });
                });
            }
            else
            {
                next(new AppError('Invalid username or password',401));

            }
        });


    }

    /*for(let x of arrayUsers)
    {
        if(x.username===req.params.username)
        {
            bcrypt.compare(req.params.password,x.password,(err,result)=>{
                if(err)
                {
                    next(new AppError('Invalid Username or Password',401));
                }
                if(result)
                {
                    res.status(200).json({
                        "success":"You are logged in!",
                        "user":x
                    });
                }
                else
                {
                    next(new AppError('Invalid Username or Password',401));
                }

            });
            user=x;
            break;
        }
    }*/
});

export default userRouter;