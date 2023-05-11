import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { ProductService } from 'src/app/services/product.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  public name: string;
  isLoginin: boolean;

  constructor(
    private _service: LoginService,
    private _serviceProduct: ProductService,
    private _r: Router
  ) { }

  ngOnInit(): void {
    this.changeName(sessionStorage.getItem("name"));

    this.isLoginin = (sessionStorage.getItem("name") != null);

    this.subscription = this._service.LoginEvent.subscribe(name => {
      this.changeName(name);

      this.isLoginin = (sessionStorage.getItem("name") != null);
    });
  };

  public changeName(name: string) {
    console.log("Header.changeName: name = ", name);
    this.name = name || "guest";
  };

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  };

  public searchChange(e) {
    //console.log("headerComponent.searchChange: e = ", e);
    let term = e.target.value;
    if (term && term.length < 2) return;
    this._serviceProduct.search(term);
    //console.log("headerComponent.search: term = ", term);
  };

  public logout() {
    console.log("Header.logout");
    this._service.resetLogin();
  };
}

