import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { RecordsService, RecordsContext } from './records.service';
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar, MatPaginator } from '@angular/material';
import { Logger } from '@app/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

const log = new Logger('Records');

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss'],
  providers: [RecordsService]
})
export class RecordsComponent implements OnInit {
  records: Array<RecordsContext>;
  dataSource: any;
  isLoading: boolean;
  displayedColumns = ['select', 'office', 'adviser', 'address', 'propertyType', 'price'];
  selection = new SelectionModel<RecordsContext>(true, []);
  @ViewChild('recordPaginator') paginator: MatPaginator;


  constructor(
    private recordsService: RecordsService,
    private matSnackBar: MatSnackBar,
    private matDialog: MatDialog
  ) { }

  public ngOnInit() {
    this.getAllRecords();
  }

  public applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  public isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  public masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach((row: RecordsContext) => this.selection.select(row));
  }

  public getAllRecords(): void {
    let response: Array<RecordsContext>;
    this.isLoading = true;
    this.recordsService.getRecords()
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((data) => {
        response = data;
      }, (error) => {
        log.debug(error);
      }, () => {
        this.records = response;
        this.dataSource = new MatTableDataSource<RecordsContext>(this.records);
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        }, 50);
        log.debug(this.records);
      });
  }

  public deleteRecord(): void {
    this.selection.selected.forEach((item, i, arr) => {
      this.isLoading = true;
      let response: any;
      this.recordsService.deleteRecord(item.id)
        .pipe(finalize(() => {
          this.selection.clear();
          // tslint:disable-next-line:curly
          if (i === arr.length - 1) this.isLoading = false;
        }))
        .subscribe((data) => {
          response = data;
        }, (error) => {
          log.debug(error);
          this.matSnackBar.open('Ha ocurrido un problema, por favor intente de nuevo', 'Ok', { duration: 3000 });
        }, () => {
          this.dataSource.data
            .splice(this.dataSource.data.findIndex((element: RecordsContext) => element.id === item.id), 1);
          this.dataSource = new MatTableDataSource<RecordsContext>(this.dataSource.data);
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
          }, 50);
          if (arr.length === 1) {
            this.matSnackBar.open('Registro eliminado exitosamente', 'Ok', {
              duration: 3000,
              politeness: 'polite'
            });
          } else {
            this.matSnackBar.open('Registros eliminados exitosamente', 'Ok', {
              duration: 3000,
              politeness: 'polite'
            });
          }
        });
    });
  }

  openDialog(data: any): void {
    console.log(data);
    const dialogRef = this.matDialog.open(AppDialogDetailsComponent, {
      width: '720px',
      data: {
        title: `Propiedad: ${data.office}`,
        phone: data.phone,
        office: data.office,
        description: data.description,
        price: data.price,
        adviser: data.adviser,
        address: data.address,
        propertyType: data.propertyType,
        requirementsType: data.requirementsType,
        saleType: data.saleType
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}

@Component({
  selector: 'app-dialog-details',
  templateUrl: 'dialog-details.component.html',
})
export class AppDialogDetailsComponent implements OnInit {
  recordsForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AppDialogDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder
  ) { }

  public ngOnInit() {
    this.createRecordsForm();
  }

  public onCloseDialog(): void {
    this.dialogRef.close();
  }

  public createRecordsForm(): void {
    this.recordsForm = this.formBuilder.group({
      // tslint:disable-next-line:max-line-length
      phone: [this.data.phone, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(11)])],
      office: [this.data.office, Validators.compose([Validators.required])],
      description: [this.data.description, Validators.compose([Validators.required])],
      price: [this.data.price, Validators.compose([Validators.required, Validators.min(1)])],
      adviser: [this.data.adviser, Validators.compose([Validators.required])],
      address: [this.data.address, Validators.compose([Validators.required])],
      propertyType: [this.data.propertyType],
      requirementsType: [this.data.requirementsType],
      saleType: [this.data.saleType]
    });
    this.recordsForm.disable();
  }

  public onEditRecord() {
    (this.recordsForm.enabled) ? this.recordsForm.disable() : this.recordsForm.enable();
  }
}
