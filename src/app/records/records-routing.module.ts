import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordsComponent } from './records.component';

const routes: Routes = [
  // Module is lazy loaded, see app-routing.module.ts
  { path: '', component: RecordsComponent, data: { title: 'Records' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class RecordsRoutingModule { }
