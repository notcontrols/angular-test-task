import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

import { Card } from '../data/card';

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  constructor(private _http: HttpClient) { }

  saveCards(body: Card[]): Observable<object | null> {

    return this._http.post('/api/submitForm', body).pipe(
      // parse request data
      map((data) => {
        return data;
      }),

      // handle errors
      catchError((err: HttpErrorResponse) => {
        console.log(err);
        return of(null);
      })
    );
  }

  usernameCheck(username: string): Observable<boolean> {
    return this._http.post<{ isAvailable: boolean }>('/api/checkUsername', { username }).pipe(
      // parse request data
      map((data) => {
        return data.isAvailable;
      }),

      // handle errors
      catchError((err: HttpErrorResponse) => {
        console.log(err);
        return of(false);
      })
    );
  }

}
