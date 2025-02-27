import express from 'express';
import { BlogUser } from '../models/user.model';
import { AppError } from '../models/AppError.model';
import bcrypt from 'bcrypt';

const userRouter = express.Router();
let arrayUsers: BlogUser[]=[];
userRouter.post('/',(req,res,next)=>{

    console.log(req.body);
    bcrypt.hash(req.body.password,10,(err,hash)=>{
        console.log(hash);
        console.log(err);
        if(err)
        {
            next(new AppError('Error in hashing password',500));
        }
        const user= new BlogUser(req.body.username, hash);
        arrayUsers.push(user);

        console.log(arrayUsers);
        res.status(201).json(user);
    });
    
    
});

userRouter.get('/login/:username/:password', (req,res,next)=>{
    let user = undefined;
    for(let x of arrayUsers)
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
    }
});

export default userRouter;