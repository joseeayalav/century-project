import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadRoutingModule } from './file-upload-routing.module';
import { FileUploadComponent } from './file-upload.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@app/material.module';
import { FileUploadModule as FuModule } from 'ng2-file-upload';

@NgModule({
  imports: [
    CommonModule,
    FileUploadRoutingModule,
    FuModule,
    FlexLayoutModule,
    MaterialModule
  ],
  declarations: [FileUploadComponent]
})
export class FileUploadModule { }
