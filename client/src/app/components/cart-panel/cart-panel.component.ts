import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { CartModel } from 'src/app/models/cart-model';
import { CartProductModel } from 'src/app/models/cart-product-model';
import { ProductModel } from 'src/app/models/product-model';
import { CartsService } from 'src/app/services/carts.service';
import { LoginService } from 'src/app/services/login.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AmountProductComponent } from '../amount-product/amount-product.component';
import { ObserversModule } from '@angular/cdk/observers';
import { IAmountDialog } from 'src/app/interfaces/iamount-dialog';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-cart-panel',
  templateUrl: './cart-panel.component.html',
  styleUrls: ['./cart-panel.component.css']
})
export class CartPanelComponent implements OnInit, OnDestroy {

  @Input() state: string; // edit | view
  subscription: Subscription;

  constructor(
    public _serviceProduct: ProductService,
    private _service: CartsService,
    private _loginService: LoginService,
    private _r: Router,
    public _dialog: MatDialog
  ) { }

  public currentCart: CartModel; // original
  public currentTotal: number;
  // for search
  filteredCartItems: CartProductModel[];

  ngOnInit(): void {
    this.getCurrentCart();

    if (this.state == 'view') {
      this.subscribeToSearch();
    }
  }

  ngOnDestroy(): void {
    if (this.state == 'view') {
      this.subscription.unsubscribe();
    }
  }

  subscribeToSearch() {
    this.subscription = this._serviceProduct.SearchProduct.subscribe(term => {
      this.filterItem(term);
      //console.log("Cart-Panel.subscribe[SearchProduct]: term = ", term);
    }); //subscribeToSearch
  }

  public addProductToCart(product: ProductModel) {
    //console.log("CartPanel.addProductToCart: product = ", product);
    console.log("CartPanel.addProductToCart: currentCart = ", this.currentCart);
    // open popup
    this.openDialog(product.name).subscribe(
      (dialogResult) => {
        console.log("CartPanel.addProductToCart[openDialog]: result = ", dialogResult);
        if (this.currentCart) {
          let cartItem = new CartProductModel(product);
          cartItem.amount = dialogResult.amount;
          cartItem.id_cart = this.currentCart._id;
          console.log("CartPanel.addProductToCart: cartItem = ", cartItem);
          this.addCartItemToCart(cartItem).subscribe(
            (result) => {
              console.log("Cart-Panel.addCartItemToCart:result = ", result);
              this.getCurrentCart();
            }, err => {
              console.log(err);
            }
          )
        } else {
          this._service.newCart().subscribe(
            (cartResult) => {
              this.currentCart = cartResult.result;
              console.log("CartPanel.getNewCart: currentCart = ", this.currentCart);

              let cartItem = new CartProductModel(product);
              cartItem.amount = dialogResult.amount;
              cartItem.id_cart = this.currentCart._id;
              console.log("CartPanel.newCart: cartItem = ", cartItem);
              this.addCartItemToCart(cartItem).subscribe(
                (result) => {
                  console.log("Cart-Panel.addCartItemToCart:result = ", result);
                  this.getCurrentCart();
                }, err => {
                  console.log(err);
                }
              );
            }, err => {
              console.log(err);
            }
          );
        }
      }, err => {
        console.log(err);
      }
    );
  }; // addProductToCart

  public addCartItemToCart(cartItem: CartProductModel): Observable<CartProductModel> {
    return new Observable(observer => {
      this._service.addCartItem(cartItem).subscribe(
        (result) => {
          //console.log("Cart-Panel.addCartItemToCart:result.result = ", result.result);
          let cartItem = result.result as CartProductModel;
          //console.log("Cart-Panel.addCartItemToCart: cartItem = ", cartItem);
          observer.next(cartItem);
        }, err => {
          observer.error(err);
          //console.log(err);
        }); // addCartItem
    })
  }; // addCartItemToCart

  public getCurrentCart() {
    this._service.currentCart().subscribe(
      (result) => {
        if(result.result) {
          this.currentCart = result.result as CartModel;
          this.filteredCartItems = this.CloneItems(this.currentCart.items);
          this.getTotal();
        }
        console.log("CartPanel.getCurrentCart: this.currentCart = ", this.currentCart);
      }, err => {
        console.log(err);
        this._loginService.resetLogin();
        this._r.navigateByUrl("main");
      }
    )
  }; //getCurrentCart

  CloneItems(items: CartProductModel[]): CartProductModel[] {
    if (!items || items.length == 0) return [];

    let _result = [];
    items.forEach(item => {
      let _item = this.CloneItem(item);
      _result.push(_item);
    });
    return _result;
  };

  CloneItem(item: CartProductModel) {
    let _result = {};
    for (const key in item) {
      if (Object.prototype.hasOwnProperty.call(item, key)) {
        const element = item[key];
        _result[key] = element;
      }
    }
    return _result;
  };

  public getNewCart() {
    this._service.newCart().subscribe(
      (result) => {
        this.currentCart = result.result;
        console.log("CartPanel.getNewCart: currentCart = ", this.currentCart)
      }, err => {
        console.log(err);
      }
    ); // newCart().subscribe
    console.log("cartPanel.getNewCart")
  }; //getNewCart

  public deleteCart(cartID: string) {
    this._service.deleteCart(cartID).subscribe(
      (result) => {
        console.log("CartPanel.deleteCart: result = ", result);
        this.currentCart = null;
      }, err => {
        console.log(err);
      }
    )
  }; // delete Cart

  // 6048cb4905df941b58e36135
  public removeProduct(cartItemID: string) {
    //console.log('CartPanel.removeProduct: cartItemID = ', cartItemID);

    this._service.deleteCartItem(cartItemID).subscribe(
      (result) => {
        console.log("CartPanel.removeProduct: result = ", result);
        this.getCurrentCart();
      }, err => {
        console.error(err);
      }
    )
  }; // delete Product

  public openDialog(productName: string): Observable<IAmountDialog> {
    return new Observable(observer => {
      const dialogRef = this._dialog.open(AmountProductComponent, {
        height: '250px',
        width: '300px',
        data: { name: productName, amount: 1 }
      });
      dialogRef.afterClosed().subscribe((result: IAmountDialog) => {
        console.log('The dialog was closed');
        //this.amount = result;
        observer.next(result);
      }, err => {
        observer.error(err);
      });
    })
  }; // openDialog

  public getTotal() {
    // reset total
    this.currentTotal = 0;
    if (this.currentCart && this.currentCart.items) {
      this.currentCart.items.forEach(item => {
        let _totalAmount = item.amount * item.origin_price
        this.currentTotal += _totalAmount
      })
      console.log("cart-panel.getTotal: currentTotal = ", this.currentTotal);
    }
  }; // get Total

  public filterItem(term: string) {
    console.log("Cart-Panel.filterItem: term = ", term);
    // 1. reset
    this.filteredCartItems = this.CloneItems(this.currentCart.items);
    console.log("Cart-Panel.filterItem: reset currentCart.items = ", this.currentCart.items);
    // 2. check if term is empty
    if (!term) return;
    // 3. mark items by term (map)
    this.filteredCartItems.map(item => {
      if (item.name.toLowerCase().indexOf(term.toLowerCase()) > -1) {
        item.mark = "searchMark"
      }
    })
    console.log("Cart-Panel.filterItem: map filteredCartItems = ", this.filteredCartItems);
  }

}
