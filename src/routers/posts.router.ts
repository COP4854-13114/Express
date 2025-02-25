import express from 'express';
import { BlogPost } from '../models/post.model';
import { AppError } from '../models/AppError.model';

const router = express.Router();

let posts: BlogPost[] =[];

router.post('/', (req,res,next)=>{
    if(req.body.title && req.body.content)
    {
        let post = new BlogPost(req.body.title, req.body.content);
        posts.push(post);
        console.log(posts);
        res.status(201).json(post);
    }
    else
    {
        next(new AppError('Title and Content Are Rquired',400));
    }
});

router.get('/', (req,res,next)=>{
    res.status(200).json(posts);
});
router.get('/Basic', (req,res,next)=>{
    //res.json(posts);
    let htmlResponse = '';
    for(let post of posts)
    {
        htmlResponse += `<h2>${post.title}</h2><p>${post.content}</p><hr/>`;
    }
    res.send(htmlResponse);
});

router.get('/Pug',(req,res,next)=>{
    res.render('posts',{postArray:posts});
});

router.get('/ejs', (req,res, next)=>{
    res.render('posts.ejs',{postArray:posts})
});

router.get('/hbs', (req,res, next)=>{
    res.render('posts',{postArray:posts})
});

export default router;