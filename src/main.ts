import express, {Request,Response,ErrorRequestHandler,NextFunction} from 'express';
import { SiteCounter } from './sitecounter';

const app = express();

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
app.use(express.json());
app.use(express.urlencoded({extended:true}));

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
        res.status(403);
        
        next(new Error('No horseing around'));
    }
    else
        res.send(`Hello World: ${req.body.Name}`);
    
});

app.use((err:Error,req:Request,res:Response,next:NextFunction)=>{
    
    res.json({
        status: res.statusCode,
        message: err.message
    })
});

app.listen(3000);