import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CartModel } from 'src/app/models/cart-model';
import { CartProductModel } from 'src/app/models/cart-product-model';
import { CartsService } from 'src/app/services/carts.service';
import { LoginService } from 'src/app/services/login.service';
import { CartPanelComponent } from '../cart-panel/cart-panel.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  @Input() total: number;
  //@Input() cart: CartModel;
  @Input() cartID: string;
  @Input() cartItems: CartProductModel[];

  @Input() state: string; // edit | view
  @Output() onDeleteCart: EventEmitter<string> = new EventEmitter<string>();
  @Output() onDeleteProductByCart: EventEmitter<string> = new EventEmitter<string>()

  public onOrder: boolean = true;

  constructor(
    private _service: CartsService,
    private _loginService: LoginService,
    private _r: Router) { }

  ngOnInit(): void {
  }

  public deleteCart(cartID: string) {
    this.onDeleteCart.emit(cartID);
  }; // delete Cart


  public removeProduct(cartItemID: string) {
    this.onDeleteProductByCart.emit(cartItemID);
  }; // delete Product

  public toggle() {
    this.onOrder = !this.onOrder;
  };
}
