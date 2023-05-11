import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductModel } from 'src/app/models/product-model';
import { LoginService } from 'src/app/services/login.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-products-view',
  templateUrl: './products-view.component.html',
  styleUrls: ['./products-view.component.css']
})
export class ProductsViewComponent implements OnInit, OnDestroy {

  @Output() onProductSelected: EventEmitter<ProductModel> = new EventEmitter<ProductModel>();

  subscription: Subscription;
  public products: ProductModel[] = [];
  private selectedCategory: number = 1;

  constructor(
    private _service: ProductService,
    private _loginService: LoginService,
    private _r: Router
  ) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    // console.log("ProductsView.ngOnInit");
    this.subscription = this._service.SearchProduct.subscribe(term => {
      if (!term) {
        this.getProductByCategory(this.selectedCategory);
        console.log("ProductsView.subscribe[SearchProduct]: selectedCategory = ", this.selectedCategory);
      } else {
        console.log("ProductsView.subscribe[SearchProduct]: term = ", term);
        this.searchProduct(term);
      }
    });
  }

  public RefreshProducts() {
    // refersh by this.selectedCategory
    this.getProductByCategory(this.selectedCategory)
  };

  public getProductByCategory(categoryID: number) {
    console.log("ProductsView.getProductByCategory: categoryID = ", categoryID);
    this.selectedCategory = categoryID;
    this._service.getProductByCategoryId(categoryID).subscribe(
      (result) => {
        this.products = result.result
        console.log("ProductsView.getProductByCategory:products = ", this.products);
      }, err => {
        console.log(err);
      }
    )
  };


  public logout() {
    console.log("ProductsView.logout");
    this._loginService.changeLoginName("guest");
    this._r.navigateByUrl("/main");
  };

  public productSelected(product: ProductModel) {
    console.log("Products-view.productSelected: product = ", product);
    this.onProductSelected.emit(product);
  };

  public searchProduct(term: string) {
    this._service.getProductByTerm(term).subscribe(
      (result) => {
        console.log("ProductsView.searchProduct: result = ", result);
        this.products = result.result
        console.log("ProductsView.searchProduct: products = ", this.products);
      }, err => {
        console.log(err);
      })
  }; // search Product
}
