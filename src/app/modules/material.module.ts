import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  MatButtonModule, MatToolbarModule, MatInputModule, MatProgressSpinnerModule, MatCardModule, MatSelectModule, MatCheckboxModule,
  MatSidenavModule, MatIconModule, MatListModule, MatSnackBarModule, MatGridListModule, MatAutocompleteModule, MatDialogModule
} from '@angular/material';

@NgModule({
  imports: [MatButtonModule, MatToolbarModule, MatListModule, MatSnackBarModule, MatGridListModule, MatSelectModule, MatCheckboxModule,
    MatInputModule, MatProgressSpinnerModule, MatCardModule, MatSidenavModule, MatIconModule, MatAutocompleteModule, MatDialogModule],

  exports: [MatButtonModule, MatToolbarModule, MatListModule, MatSnackBarModule, MatGridListModule, MatSelectModule, MatCheckboxModule,
    MatInputModule, MatProgressSpinnerModule, MatCardModule, MatSidenavModule, MatIconModule, MatAutocompleteModule, MatDialogModule],

})
export class MaterialModule { }
