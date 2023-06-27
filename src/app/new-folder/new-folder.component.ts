import { Component, Inject } from '@angular/core';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-new-folder',
  templateUrl: './new-folder.component.html',
  styleUrls: ['./new-folder.component.css']
})
export class NewFolderComponent {

  myForm!: FormGroup;

  // constructor(
  //   public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
  //   @Inject(MAT_DIALOG_DATA) public data: Request, private formBuilder: FormBuilder
  // ) {

  //   this.myForm = this.formBuilder.group({
   
  //   });
  //  }


}
