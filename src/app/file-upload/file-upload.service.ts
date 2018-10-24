import { Injectable } from '@angular/core';
import { RecordsContext } from '@app/records/records.service';
import { Observable } from 'rxjs/internal/Observable';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs/internal/observable/of';
import { HttpParamsOptions } from '@angular/common/http/src/params';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(
    private httpClient: HttpClient
  ) { }

  public uploadZip(file: any): Observable<any> {
    const formData = new FormData();
    formData.append('file', file.file.rawFile, 'file.zip');
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.httpClient.post('file-upload', formData).pipe(
      map((data: RecordsContext) => data),
      catchError(() => of('No se pudo crear el registro'))
    );
  }
}
