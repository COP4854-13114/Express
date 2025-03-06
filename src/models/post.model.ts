import { BlogCategory } from "./category.model";

export class BlogPost 
{
    title:string='';
    postedBy:string='';
    content:string='';
    postedDate:Date = new Date();
    category: BlogCategory|undefined=undefined;
    constructor(title:string, content:string)
    {
        this.title = title;
        this.content = content;
    }
}