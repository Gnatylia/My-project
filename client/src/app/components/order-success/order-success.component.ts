import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IAmountDialog } from 'src/app/interfaces/iamount-dialog';

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.css']
})
export class OrderSuccessComponent implements OnInit {


  constructor(
    public _r: Router,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) { }

  ngOnInit(): void {
    console.log("OrderSuccess: data = ", this.data);
  }

  public goToMain() {
    this._r.navigateByUrl("/main");
  }

}
