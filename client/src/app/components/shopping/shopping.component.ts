import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductModel } from 'src/app/models/product-model';
import { LoginService } from 'src/app/services/login.service';
import { CartPanelComponent } from '../cart-panel/cart-panel.component';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.css']
})
export class ShoppingComponent implements OnInit, OnDestroy {

  @ViewChild('cartPanel') cartPanel: CartPanelComponent;

  logOutSubscription: Subscription;

  constructor(
    private _service: LoginService,
    private _r: Router
  ) { }

  public product: ProductModel

  ngOnInit(): void {
    this.logOutSubscription = this.subscribeToLogout();
  }

  ngOnDestroy(): void {
    if (this.logOutSubscription) {
      this.logOutSubscription.unsubscribe();
    }
  };

  subscribeToLogout() {
    return this._service.LogoutEvent.subscribe(isLogout => {
      console.log("Shopping: LogoutEvent.subscribe - ", isLogout);
      this._r.navigateByUrl("/main");
    });
  };


  public ProductSelected(product: ProductModel) {
    console.log("Shopping.ProductSelected: product = ", product);
    this.cartPanel.addProductToCart(product);
  };

}
