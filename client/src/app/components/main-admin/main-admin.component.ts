import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductModel } from 'src/app/models/product-model';
import { LoginService } from 'src/app/services/login.service';
import { ProductService } from 'src/app/services/product.service';
import { AdminPanelComponent } from '../admin-panel/admin-panel.component';
import { ProductsViewComponent } from '../products-view/products-view.component';

@Component({
  selector: 'app-main-admin',
  templateUrl: './main-admin.component.html',
  styleUrls: ['./main-admin.component.css']
})
// , AfterViewInit
export class MainAdminComponent implements OnInit, OnDestroy {

  @ViewChild('prodView') productsView: ProductsViewComponent;
  @ViewChild('adminPanel') adminPanel: AdminPanelComponent;

  logOutSubscription: Subscription;

  constructor(
    private _service: ProductService,
    private _serviceLogin: LoginService,
    public _r: Router
  ) { }

  ngOnInit(): void {
    this.logOutSubscription = this.subscribeToLogout();
  }

  ngOnDestroy(): void {
    if (this.logOutSubscription) {
      this.logOutSubscription.unsubscribe();
    }
  }

  public refreshProducts() {
    this.productsView.RefreshProducts();
  };


  public ProductSelected(product: ProductModel) {
    console.log("Main-admin.ProductSelected: product = ", product);
    this.adminPanel.openForm(product);
    console.log("Main-admin.ProductSelected.openForm: product = ", product);
  };

  subscribeToLogout() {
    return this._serviceLogin.LogoutEvent.subscribe(isLogout => {
      console.log("MainAdmin: LogoutEvent.subscribe - ", isLogout);
      this._r.navigateByUrl("/main");
    });
  };
}
