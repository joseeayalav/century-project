import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { HomeService, RecordsContext } from './home.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Logger } from '@app/core';

const log = new Logger('Home');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [HomeService]
})
export class HomeComponent implements OnInit {
  recordsForm: FormGroup;
  records: Array<RecordsContext>;
  isLoading: boolean;
  message: string;

  constructor(
    private homeService: HomeService,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar
  ) { }

  public ngOnInit() {
    this.createRecordsForm();
    this.getMessage();
  }

  public createRecordsForm(): void {
    this.recordsForm = this.formBuilder.group({
      phone: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(11)])],
      office: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
      price: ['', Validators.compose([Validators.required, Validators.min(1)])],
      adviser: ['', Validators.compose([Validators.required])],
      address: ['', Validators.compose([Validators.required])],
      propertyType: [''],
      requirementsType: [''],
      saleType: ['']
    });
  }

  public createRecord(): void {
    let response: RecordsContext;
    this.isLoading = true;
    this.homeService.createRecord(this.recordsForm.value).pipe(finalize(() => {
      this.isLoading = false;
    })).subscribe((data) => {
      response = data;
    }, (error) => {
      console.log(error);
      this.matSnackBar.open('Ha ocurrido un problema, por favor intente de nuevo', 'Ok', { duration: 3000 });
    }, () => {
      switch (String(response)) {
        case 'No se pudo crear el registro':
          this.matSnackBar.open('Ha ocurrido un problema, por favor intente de nuevo', 'Ok', { duration: 3000 });
          break;
        default:
          this.matSnackBar.open('Registro realizado exitosamente', 'Ok', { duration: 3000 });
          this.recordsForm.reset();
          break;
      }
    });
  }

  public getMessage() {
    let response: any;
    this.isLoading = true;
    this.homeService.getMessage().pipe(finalize(() => {
      this.isLoading = false;
    })).subscribe((data) => {
      response = data;
    }, (error) => {
      log.debug(error);
    }, () => {
      log.debug(response);
      this.message = response.content.toUpperCase();
    });
  }
}
