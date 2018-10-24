import { Title } from '@angular/platform-browser';
import { Component, OnInit, Inject } from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';
import { HomeService } from '@app/home/home.service';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
  providers: [HomeService]
})
export class ShellComponent implements OnInit {

  constructor(
    private titleService: Title,
    private media: ObservableMedia,
    private matDialog: MatDialog
  ) { }

  ngOnInit() { }

  get isMobile(): boolean {
    return this.media.isActive('xs') || this.media.isActive('sm');
  }

  get title(): string {
    return this.titleService.getTitle();
  }

  openDialog(): void {
    const dialogRef = this.matDialog.open(AppDialogDeleteComponent, {
      width: '420px',
      data: {
        title: 'Eliminar Mensajes',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}

@Component({
  selector: 'app-dialog-delete',
  templateUrl: 'dialog-delete.component.html',
  providers: [HomeService]
})
export class AppDialogDeleteComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AppDialogDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private homeService: HomeService,
    private matSnackBar: MatSnackBar,
  ) { }

  public ngOnInit() {
  }

  public onCloseDialog(): void {
    this.dialogRef.close();
  }

  public onDeleteMessages(): void {
    this.homeService.deleteMessages().subscribe(
      (data) => console.log(data),
      (error) => {
        console.log(error);
        this.matSnackBar.open('Ha ocurrido un error, por favor intente nuevamente', 'Ok');
      }, () => {
        this.matSnackBar.open('¡Todos los mensajes se eliminaron exitosamente!', 'Ok');
      }
    );
  }
}
