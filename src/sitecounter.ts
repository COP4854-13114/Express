export class SiteCounter
{
    Url:string='';
    Count:number=0;
    Method:'GET'|'PUT'|'PATCH'|'POST'|'DELETE'='GET';

    IncrementCount()
    {
        this.Count++;
    }
}