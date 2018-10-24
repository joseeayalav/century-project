import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface RecordsContext {
  id: number;
  office: string;
  adviser: string;
  phone: string;
  price: number;
  address: string;
  requirementsType: string;
  description: string;
  propertyType: string;
  saleType: string;
}

@Injectable()
export class RecordsService {

  constructor(private httpClient: HttpClient) { }

  public getRecords(): Observable<any> {
    return this.httpClient
      .get('records')
      .pipe(
        map((body: RecordsContext) => body),
        catchError(() => of('No se pudo obtener los registros'))
      );
  }

  public deleteRecord(ID: any): Observable<any> {
    return this.httpClient
      .delete('records/' + ID)
      .pipe(
        map((body: RecordsContext) => body),
        catchError(() => of('No se pudo eliminar el registro'))
      );
  }

}
