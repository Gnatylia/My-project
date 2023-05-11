import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-main-order',
  templateUrl: './main-order.component.html',
  styleUrls: ['./main-order.component.css']
})
export class MainOrderComponent implements OnInit, OnDestroy {

  logOutSubscription: Subscription;

  constructor(
    private _service: LoginService,
    private _r: Router
  ) { }

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
      console.log("MainOrder: LogoutEvent.subscribe - ", isLogout);
      this._r.navigateByUrl("/main");
    })
  };

}
