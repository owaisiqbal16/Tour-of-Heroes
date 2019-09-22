import { Injectable } from '@angular/core';
import { City } from './city';
import { Observable , of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getCities(): Observable<City[]> {
    return this.http.get<City[]>('http://localhost:3000/cities')
      .pipe(
        tap(_ => this.log('fetched cities')),
        catchError(this.handleError<City[]>('getCities', []))
      );
  };

  getCity(id: number): Observable<City> {
    const url = `http://localhost:3000/cities/${id}`;
    return this.http.get<City>(url).pipe(
      tap(_ => this.log(`fetched costume id=${id}`)),
      catchError(this.handleError<City>(`getCity id=${id}`))
    );
  }

  addCity(city : City): Observable<City> {
    return this.http.post<City>('http://localhost:3000/cities', city, this.httpOptions)
      .pipe(
      tap((newCity: City) => this.log(`added city w/ id=${newCity.id}`)),
      catchError(this.handleError<City>('addCity'))
    );
  }

  updateCostume(city: City): Observable<any> {
    const id = typeof city === 'number' ? city : city.id;
    return this.http.put( `http://localhost:3000/cities/${id}` , city, this.httpOptions).pipe(
      tap(_ => this.log(`updated city id=${city.id}`)),
      catchError(this.handleError<any>('updateCity'))
    );
  }

  deleteCostume(city: City | number): Observable<City> {
    const id = typeof city === 'number' ? city : city.id;

    return this.http.delete<City>(`http://localhost:3000/cities/${id}` , this.httpOptions).pipe(
      tap(_ => this.log(`deleted city id=${id}`)),
      catchError(this.handleError<City>('deleteCity'))
    );
  }
  private powersUrl = 'http://localhost:3000/cities';

  private log(message: string) {
    this.messageService.add(`CityService: ${message}`);
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
