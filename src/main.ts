import express, {Request,Response,ErrorRequestHandler,NextFunction} from 'express';
import { SiteCounter } from './sitecounter';
import { AppError } from './models/AppError.model';
import { BlogPost } from './models/post.model';
import { BlogCategory } from './models/category.model';
import categoryRouter from './routers/category.router';
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/Categories',categoryRouter);

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