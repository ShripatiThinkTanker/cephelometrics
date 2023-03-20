import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import { DialogModule } from "primeng/dialog";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    DialogModule
  ],

  exports : [
    CommonModule,
    MatCardModule,
    MatIconModule,
    DialogModule
  ]
})
export class SharedModule { }
