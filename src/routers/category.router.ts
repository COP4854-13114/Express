import express from 'express';
import { BlogCategory } from '../models/category.model';
import { AppError } from '../models/AppError.model';

const router = express.Router();
let categories:BlogCategory[]=[];

router.post('/', (req,res)=>{
    let newCategory = new BlogCategory(req.body.id,req.body.displayName);
    categories.push(newCategory);
    res.status(201).json(newCategory);
});

router.get('/',(req,res)=>{
    res.status(200).json(categories);
});
router.get('/:id',(req,res,next)=>{
    
    let category = categories.find(x=>x.id===req.params.id);
    if(category===undefined)
    {
        next(new AppError('Category not found',404));
    }
    res.status(200).json(category);
});

router.patch('/:id',(req,res,next)=>{
    let category = categories.find(x=>x.id===req.params.id);
    if(category===undefined)
    {
        next(new AppError('Category not found',404));
    }
    else
    {
        if(req.body.displayName!==undefined)
        {
            category.displayName = req.body.displayName;
        }
        if(req.body.randomProperty!==undefined)
        {
            category.randomProperty = req.body.randomProperty;
        }
        if(req.body.id!==undefined)
        {
            category.id = req.body.id;
        }
        res.status(200).json(category);

    }
});

router.delete('/:id',(req,res,next)=>{
    let category = categories.find(x=>x.id===req.params.id);
    if(category===undefined)
    {
        next(new AppError('Category not found',404));
    }
    else
    {
        //categories = categories.splice(categories.indexOf(category),1);
        categories = categories.filter(x=>x.id!==req.params.id);
        res.status(204).json();
    }
});

export default router;