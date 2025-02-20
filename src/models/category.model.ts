export class BlogCategory
{
    id:string='';
    displayName:string='';
    randomProperty:string='';

    constructor(id:string, displayName:string)
    {
        this.id = id;
        this.displayName = displayName;
    }
}