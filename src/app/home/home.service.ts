import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface RecordsContext {
  id?: number;
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
export class HomeService {

  constructor(private httpClient: HttpClient) { }

  public createRecord(payload: RecordsContext): Observable<any> {
    const body = {
      office: payload.office,
      adviser: payload.adviser,
      phone: payload.phone.toString(),
      price: payload.price,
      address: payload.address,
      requirementsType: payload.requirementsType,
      description: payload.description,
      propertyType: payload.propertyType,
      saleType: payload.saleType
    };
    return this.httpClient
      .post('records/', body)
      .pipe(
        map((data: RecordsContext) => data),
        catchError(() => of('No se pudo crear el registro'))
      );
  }

  public getMessage(): Observable<any> {
    return this.httpClient.get('messages/')
      .pipe(
        map((data: RecordsContext) => data),
        catchError(() => of('No se pudo obtener ningún mensaje'))
      );
  }

  public deleteMessages(): Observable<any> {
    return this.httpClient.delete('messages/erase_messages/')
      .pipe(
        map((data: RecordsContext) => data),
        catchError(() => of('No se pudo obtener ningún mensaje'))
      );
  }

}
