"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sitecounter_1 = require("./sitecounter");
const AppError_model_1 = require("./models/AppError.model");
const category_router_1 = __importDefault(require("./routers/category.router"));
const user_router_1 = __importDefault(require("./routers/user.router"));
const posts_router_1 = __importDefault(require("./routers/posts.router"));
const express_handlebars_1 = require("express-handlebars");
const auth_guard_1 = require("./guards/auth.guard");
const app = (0, express_1.default)();
app.get('/horse', auth_guard_1.AuthMiddleWare, (req, res, next) => {
    console.log(req.headers['current_user']);
    res.send('Horse');
});
//app.set('view engine','pug'); //use pug
//app.set('view engine','ejs'); //use ejs
app.engine('hbs', (0, express_handlebars_1.engine)()); //Register handlebars cause its special
app.set('view engine', 'hbs');
app.set('views', 'views');
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/Categories', category_router_1.default);
app.use('/Posts', posts_router_1.default);
app.use('/Users', user_router_1.default);
let blogPosts = [];
let siteCounters = [];
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
app.use('/', (req, res, next) => {
    if (siteCounters.length >= 0) {
        let found = false;
        for (let x of siteCounters) {
            if (x.Url === req.url) {
                x.IncrementCount();
                found = true;
                break;
            }
        }
        if (!found) {
            let currentCounter = new sitecounter_1.SiteCounter();
            currentCounter.IncrementCount();
            currentCounter.Url = req.url;
            currentCounter.Method = req.method;
            siteCounters.push(currentCounter);
        }
    }
    else {
        let currentCounter = new sitecounter_1.SiteCounter();
        currentCounter.IncrementCount();
        currentCounter.Url = req.url;
        currentCounter.Method = req.method;
        siteCounters.push(currentCounter);
    }
    console.log(siteCounters);
    next();
});
app.use(express_1.default.static('public'));
app.get('/counter', (req, res) => {
    res.status(200).json(siteCounters);
});
app.use('/', (req, res, next) => {
    console.log(`Body: ${JSON.stringify(req.body)}`);
    if (req.url === '/Horse') {
        //res.status(403);
        next(new AppError_model_1.AppError('No horseing around', 403));
    }
    else
        res.send(`Hello World: ${req.body.Name}`);
});
app.use((err, req, res, next) => {
    res.status(err.statusCode).json({
        status: err.statusCode,
        message: err.message
    });
});
app.listen(3000);
