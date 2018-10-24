import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedModule } from '@app/shared';
import { MaterialModule } from '@app/material.module';
import { RecordsRoutingModule } from './records-routing.module';
import { RecordsComponent, AppDialogDetailsComponent } from './records.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    ReactiveFormsModule,
    RecordsRoutingModule,
  ],
  declarations: [
    RecordsComponent,
    AppDialogDetailsComponent
  ],
  entryComponents: [
    AppDialogDetailsComponent
  ]
})
export class RecordsModule { }
