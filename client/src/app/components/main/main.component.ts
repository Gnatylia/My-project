import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {

  public islogin: boolean; // false
  subscibtion: Subscription;

  constructor(
    public _service: LoginService
  ) { }  

  ngOnInit(): void {
    this.islogin = this._service.isLogin();

    this.subscibtion = this._service.LoginEvent.subscribe(result => {
      this.islogin = this._service.isLogin();
    })
  }

  ngOnDestroy(): void {
    if(this.subscibtion){
      this.subscibtion.unsubscribe();
    }
  }

}
