import { Injectable } from '@angular/core';
import { Power } from './power';
import { Observable , of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import {heroPower} from './heroPower';

@Injectable({
  providedIn: 'root'
})
export class PowerService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getPowers(): Observable<Power[]> {
    return this.http.get<Power[]>('http://localhost:3000/powers')
      .pipe(
        tap(_ => this.log('fetched powers')),
        catchError(this.handleError<Power[]>('getPowers', []))
      );
  };

  getPower(id: number): Observable<Power> {
    const url = `http://localhost:3000/powers/${id}`;
    return this.http.get<Power>(url).pipe(
      tap(_ => this.log(`fetched power id=${id}`)),
      catchError(this.handleError<Power>(`getPower id=${id}`))
    );
  }

  /** POST: add a new hero to the server */
  addPower(power: Power): Observable<Power> {
    return this.http.post<Power>('http://localhost:3000/powers', power, this.httpOptions)
      .pipe(
      tap((newPower: Power) => this.log(`added power w/ id=${newPower.id}`)),
      catchError(this.handleError<Power>('addPower'))
    );
  }

  updatePower(power: Power): Observable<any> {
    const id = typeof power === 'number' ? power : power.id;
    return this.http.put( `http://localhost:3000/powers/${id}` , power, this.httpOptions).pipe(
      tap(_ => this.log(`updated power id=${power.id}`)),
      catchError(this.handleError<any>('updatePower'))
    );
  }

  /** DELETE: delete the hero from the server */
  deletePower(power: Power | number): Observable<Power> {
    const id = typeof power === 'number' ? power : power.id;

    return this.http.delete<Power>(`http://localhost:3000/powers/${id}` , this.httpOptions).pipe(
      tap(_ => this.log(`deleted power id=${id}`)),
      catchError(this.handleError<Power>('deletePower'))
    );
  }
  
  getHeroPowers(id: number): Observable<Power[]> {
    const url = `http://localhost:3000/heropowers/${id}`;
    return this.http.get<Power[]>(url).pipe(
      tap(_ => this.log(`fetched power id=${id}`)),
      catchError(this.handleError<Power[]>(`getPower id=${id}`))
    );
  }

  // addPower(power: Power): Observable<Power> {
  //   return this.http.post<Power>('http://localhost:3000/powers', power, this.httpOptions)
  //     .pipe(
  //     tap((newPower: Power) => this.log(`added power w/ id=${newPower.id}`)),
  //     catchError(this.handleError<Power>('addPower'))
  //   );
  // }

  addPowerToHero(data : heroPower): Observable<heroPower> {
    let hid = data.hero_id;
    let pid = data.power_id;
    console.log(data)
    return this.http.post<any>(`http://localhost:3000/heropowers/${hid}/${pid}`, this.httpOptions).pipe(
      tap(_ => this.log(`added power to hero id=${hid}`)),
      catchError(this.handleError<any>(`addPowerToHero id=${hid}`))
    );
  }

  deletePowerFromHero(id : number): Observable<any> {
    return this.http.delete<any>(`http://localhost:3000/heropowers/${id}`, this.httpOptions).pipe(
      tap(_ => this.log(`deleted power from hero id=${id}`)),
      catchError(this.handleError<any>(`deletePowerFromHero id=${id}`))
    );
  }

  private powersUrl = 'http://localhost:3000/powers';

  private log(message: string) {
    this.messageService.add(`PowerService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }
}
