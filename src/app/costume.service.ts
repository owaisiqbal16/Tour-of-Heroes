import { Injectable } from '@angular/core';
import { Costume } from './costume';
import { Observable , of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CostumeService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getCostumes(): Observable<Costume[]> {
    return this.http.get<Costume[]>('http://localhost:3000/costumes')
      .pipe(
        tap(_ => this.log('fetched costumes')),
        catchError(this.handleError<Costume[]>('getCostumes', []))
      );
  };

  getCostume(id: number): Observable<Costume> {
    const url = `http://localhost:3000/costumes/${id}`;
    return this.http.get<Costume>(url).pipe(
      tap(_ => this.log(`fetched costume id=${id}`)),
      catchError(this.handleError<Costume>(`getCostume id=${id}`))
    );
  }

  addCostume(costume : Costume): Observable<Costume> {
    return this.http.post<Costume>('http://localhost:3000/costumes', costume, this.httpOptions)
      .pipe(
      tap((newCostume: Costume) => this.log(`added costume w/ id=${newCostume.id}`)),
      catchError(this.handleError<Costume>('addCostume'))
    );
  }

  updateCostume(costume: Costume): Observable<any> {
    const id = typeof costume === 'number' ? costume : costume.id;
    return this.http.put( `http://localhost:3000/costumes/${id}` , costume, this.httpOptions).pipe(
      tap(_ => this.log(`updated costume id=${costume.id}`)),
      catchError(this.handleError<any>('updateCostume'))
    );
  }

  deleteCostume(costume: Costume | number): Observable<Costume> {
    const id = typeof costume === 'number' ? costume : costume.id;

    return this.http.delete<Costume>(`http://localhost:3000/costumes/${id}` , this.httpOptions).pipe(
      tap(_ => this.log(`deleted costume id=${id}`)),
      catchError(this.handleError<Costume>('deleteCostume'))
    );
  }
  private powersUrl = 'http://localhost:3000/costumes';

  private log(message: string) {
    this.messageService.add(`CostumeService: ${message}`);
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
