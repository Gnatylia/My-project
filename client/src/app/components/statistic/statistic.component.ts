import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartModel } from 'src/app/models/cart-model';
import { CartsService } from 'src/app/services/carts.service';
import { LoginService } from 'src/app/services/login.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css']
})
export class StatisticComponent implements OnInit, OnDestroy {

  public countOrders: number;
  public countProducts: number;
  public currentCart: CartModel;
  public nameUser: string;
  subscibtion: Subscription;

  constructor(
    public _service: OrderService,
    public _serviceProduct: ProductService,
    public _serviceCart: CartsService,
    public _serviceLogin: LoginService
  ) { }

  ngOnInit(): void {
    this._service.getCountOrders().subscribe(
      (result) => {
        this.countOrders = result.result
      }, err => {
        console.log(err)
      }
    );

    this._serviceProduct.getCountProducts().subscribe(
      (result) => {
        this.countProducts = result.result
      }, err => {
        console.log(err)
      }
    );

    this.CheckLogin();
  }
  CheckLogin() {
    if (this._serviceLogin.isLogin()) {
      let _name = sessionStorage.getItem("name");
      console.log("isLogin: _name = ", _name);
      this.getCurrentCart();
      this.nameUser = _name;
    }

    this.subscibtion = this._serviceLogin.LoginEvent.subscribe(userName => {
      //let _name = sessionStorage.getItem("name");
      console.log("isLogin: userName = ", userName);
      this.getCurrentCart();
      this.nameUser = userName;
    });
  }

  ngOnDestroy(): void {
    if (this.subscibtion) {
      this.subscibtion.unsubscribe();
    }
  }

  public getCurrentCart() {
    this._serviceCart.currentCart().subscribe(
      (result) => {
        this.currentCart = result.result
        console.log("Statistic.getCurrentCart:currentCart = ", this.currentCart);
      }, (err) => {
        console.log(err);
      }
    )
  }; // get current Cart


}
