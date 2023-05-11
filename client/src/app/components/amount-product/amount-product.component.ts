import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IAmountDialog } from 'src/app/interfaces/iamount-dialog';

@Component({
  selector: 'app-amount-product',
  templateUrl: './amount-product.component.html',
  styleUrls: ['./amount-product.component.css']
})
export class AmountProductComponent implements OnInit {


  public myForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    public _dialog: MatDialog,
    public _dialogRef: MatDialogRef<AmountProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IAmountDialog) { }


  ngOnInit(): void {
    this.myForm = this._fb.group({
      amount: ["", Validators.required]
    });
    this.myForm.setValue({
      amount: this.data.amount
    });
  }

  public close() {

    // get data from controls
    let _amount = this.myForm.value['amount'];
    let _result: IAmountDialog = { name: this.data.name, amount: _amount };
    this._dialogRef.close(_result);
  }

}

