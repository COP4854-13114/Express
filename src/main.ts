import express, {Request,Response,ErrorRequestHandler,NextFunction} from 'express';
import { SiteCounter } from './sitecounter';
import { AppError } from './models/AppError.model';
import { BlogPost } from './models/post.model';
import { BlogCategory } from './models/category.model';
import categoryRouter from './routers/category.router';
import userRouter from './routers/user.router';
import postRouter from './routers/posts.router'
import  {engine} from 'express-handlebars';

const app = express();

//app.set('view engine','pug'); //use pug
//app.set('view engine','ejs'); //use ejs

app.engine('hbs', engine()); //Register handlebars cause its special
app.set('view engine','hbs');
app.set('views','views');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/Categories',categoryRouter);
app.use('/Posts',postRouter);
app.use('/Users',userRouter);

let blogPosts:BlogPost[]=[];












let siteCounters:SiteCounter[]=[];

/*app.use('/', (req,res,next)=>{
    let totalData='';
    req.on('data', (data)=>{
        totalData+=data.ToString()
    });
    req.on('end', ()=>{
        req.body=totalData;
        next();
    });
});*/ //Manual Way of Reading Body Data or Content


app.use('/',(req,res,next)=>{
    
    if(siteCounters.length>=0)
    {
        let found=false;
        for(let x of siteCounters)
        {
            if(x.Url===req.url)
            {
                x.IncrementCount();
                found=true;
                break;
            }
        }
        if(!found)
        {
            let currentCounter= new SiteCounter();
            currentCounter.IncrementCount();
            currentCounter.Url=req.url;
            currentCounter.Method=req.method as 'GET'|'PUT'|'PATCH'|'POST'|'DELETE';
            siteCounters.push(currentCounter);
        }
        
    }
    else
    {
        let currentCounter= new SiteCounter();
        
        currentCounter.IncrementCount();
        currentCounter.Url=req.url;
        currentCounter.Method=req.method as 'GET'|'PUT'|'PATCH'|'POST'|'DELETE';
        siteCounters.push(currentCounter);
    }
    console.log(siteCounters);
    next();
    
});

app.use(express.static('public'));

app.get('/counter',(req,res)=>{
    res.status(200).json(siteCounters);
});

app.use('/', (req,res,next)=>{
    console.log(`Body: ${JSON.stringify(req.body)}`);
    if(req.url==='/Horse')
    {
        //res.status(403);
        
        next(new AppError('No horseing around',403));
    }
    else
        res.send(`Hello World: ${req.body.Name}`);
    
});

app.use((err:AppError,req:Request,res:Response,next:NextFunction)=>{
    
    res.status(err.statusCode).json({
        status: err.statusCode,
        message: err.message
    })
});

app.listen(3000);