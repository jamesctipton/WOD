import { Injectable } from "@angular/core";
import { User } from "./user";

@Injectable({
    providedIn: 'root'
  })
export class Globals {

    public url: string = 'https://wateroil.itongue.cn';
    public token: string = "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlhBVjVZQzVTUFYifQ.eyJpc3MiOiJaQTVSOVg4NUI1IiwiaWF0IjoxNjUzMzY1NTE5LCJleHAiOjE2NzI0NDQ4MDB9.al1bW4MPG9yom_cEZh13dDyAWnrmuU2QsUo-8_ziE9I-iqydqKBcm5GEbYNgfPSPjaXGsrR4nmlBosbPpgfvxQ";
}