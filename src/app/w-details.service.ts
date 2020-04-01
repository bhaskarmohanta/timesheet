import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { weekDetails } from './weekly-report/wdetails';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WDetailsService {

  private _url : string = "../assets/data/1604054/2020/weeks.json"; 

  constructor(private http: HttpClient) { }


  getwDetails(): Observable<weekDetails[]>{
      return this.http.get<weekDetails[]>(this._url);
  }
}
