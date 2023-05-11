import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IUserDetails } from 'src/app/interfaces/iuser-details';
import { OrderModel } from 'src/app/models/order-model';
import { CartsService } from 'src/app/services/carts.service';
import { OrderService } from 'src/app/services/order.service';
import { OrderSuccessComponent } from '../order-success/order-success.component';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit {

  public _order: OrderModel;
  public myForm: FormGroup;
  private userDetails: IUserDetails;
  public closedDates: any[] = [];
  public today: Date = new Date();
  public isValidError: boolean;

  constructor(
    private _service: CartsService,
    private _serviceOrder: OrderService,
    private _fb: FormBuilder,
    private _r: Router,
    public _dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.myForm = this._fb.group({
      city: ["", Validators.required],
      street: ["", Validators.required],
      date: ["", Validators.required],
      card: ["", Validators.required]
    });
    
    this.getUserDetails();
    this.getClosedDates()
   
  }

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    
    const _date = (d || new Date());
    
    _date.setDate(_date.getDate() + 1);
    let _dateString = _date.toISOString()// "2021-03-22T22:33:44.131Z";
    _dateString = _dateString.substr(0, _dateString.indexOf('T')); // "2021-03-22"
    
    let _isAvaibleDate = this.closedDates
      .indexOf(_dateString) == -1;

    return _isAvaibleDate && day !== 6;
  }; //myFilter

  public getUserDetails() {
    this._service.userDetails().subscribe(
      (res) => {
        if (res.result) {
          this.userDetails = res.result;
          console.log("getUserDetails: userDetails = ", this.userDetails);
        }
      }, err => {
        console.log(err)
      }
    )
  }; //getUserDetails

  public doubleClick(ctrlName: string) {
    //console.log('doubleClick: ctrlName = ', ctrlName);
    if (this.userDetails) {

      let _valueForSet = {};

      switch (ctrlName) {
        case 'city':
          _valueForSet = { city: this.userDetails.city };
          break;
        case 'street':
          _valueForSet = { street: this.userDetails.street };
          break;
      }
      //console.log('doubleClick: _valueForSet = ', _valueForSet);
      this.myForm.patchValue(_valueForSet);

    } else {
      console.log("Dont have user details");
    }
  }; //doubleClick


  public getClosedDates() {
    this._serviceOrder.getClosedDates().subscribe(
      (result) => {
        if (result.result) {
          this.closedDates = result.result;
        } else {
          console.warn("OrderForm.closedDates: ", result.msg);
        }
        console.log("OrderForm.closedDates: this.closedDates = ", this.closedDates);
      }, err => {
        console.log(err);
      }
    )
  }; //getClosedDates

  public handle_submit() {
    console.log("Order_Form.handle_submit: ", this.myForm.value);

    if (this.myForm.invalid) {
      // add error message to error field
      this.isValidError = true;
      console.log("Order_Form.handle_submit: invalid = ", this.myForm.invalid);
      return;
    }
    this.isValidError = false;

    const { city, street, date, card } = this.myForm.value;

    let _order: OrderModel = {
      city: city,
      street: street,
      date_send: date,
      credit_card: card
    };

    this._serviceOrder.createOrder(_order).subscribe(
      (result) => {
        console.log("Order_Form.saveOrder: result = ", result);
        this.isValidError = false;
        if (result.result.Invoice) {
          this.openDialog(result.result.Invoice);
        }

        
      }, err => {
       
        this.isValidError = true;
        console.log("Order_Form.saveOrder: err = ", err);
      }
    )
  }; // handle_submit

  public openDialog(invoicePath: string) {
    this._dialog.open(
      OrderSuccessComponent,
      { data: invoicePath }
    );
  }; //openDialog

}
