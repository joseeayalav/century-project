import { Component, OnInit } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import { Observable, of, zip } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { FileUploader } from 'ng2-file-upload';
import { FileUploadService } from './file-upload.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [FileUploadService]
})
export class FileUploadComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({
    url: 'https://wsmessages.herokuapp.com/file-upload',
    method: 'POST',
    headers: [
      { name: 'Content-Type', value: 'multipart/form-data' }
    ],
    queueLimit: 5,
    autoUpload: false,
    allowedMimeType: ['application/zip'],
    itemAlias: 'ZIP',
    isHTML5: true,
    maxFileSize: 10 * 512 * 512,
    allowedFileType: ['compress']
  });
  public isLoading: boolean;
  public hasBaseDropZoneOver = false;
  public hasAnotherDropZoneOver = false;

  constructor(
    private http: HttpClient,
    private fileUploadService: FileUploadService,
    private matSnackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.isLoading = false;
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  public consoleOut() {
    console.log(this.uploader.queue);
  }

  public uploadZip(item: any) {
    let response: any;
    this.isLoading = true;
    this.fileUploadService.uploadZip(item).pipe(finalize(() => {
      this.isLoading = false;
    })).subscribe((data) => {
      response = data;
    }, (error) => {
      console.log(error);
    }, () => {
      switch (String(response)) {
        case 'Done, your messages where purged, compared and uploaded to data base :)':
          this.matSnackBar.open('Archivos cargados exitosamente', 'Ok', { duration: 3000 });
          item.remove();
          break;
        case 'Sorry the file: [file.zip] should have at least a .txt file':
          this.matSnackBar.open('Archivo invalido: ¡debe contener un archivo de texto!', 'Ok', { duration: 3000 });
          break;
        default:
          this.matSnackBar.open('Ha ocurrido un problema, por favor intenta nuevamente', 'Ok', { duration: 3000 });
          break;
      }
    });
  }
}
