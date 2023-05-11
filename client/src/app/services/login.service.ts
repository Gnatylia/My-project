import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IResponseModel } from '../interfaces/iresponse-model';
import { LoginModel } from '../models/login-model';
import { UserModel } from '../models/user-model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public LoginEvent: EventEmitter<string> = new EventEmitter();

  public LogoutEvent: EventEmitter<boolean> = new EventEmitter();


  constructor(
    private http: HttpClient,
    private _r: Router) { }

  public login(login: LoginModel): Observable<IResponseModel> {
    return this.http.post('http://localhost:4000/users/login', login, {
      headers: { 'Content-Type': 'application/json' }
    }) as Observable<IResponseModel>;
  }; //Login

  public register(user: UserModel) : Observable<IResponseModel> {
    return this.http.post('http://localhost:4000/users/register', user, {
      headers: { 'Content-Type': 'application/json' }
    })  as Observable<IResponseModel>;
  }; // Register

  public getUserByID(userID: string): Observable<IResponseModel> {
    //console.log('LoginService.getUserByID: userID = ', userID);
    return this.http.get("http://localhost:4000/users/" + userID) as Observable<IResponseModel>;
  }; // get User By ID

  public changeLoginName(name: string) {
    this.LoginEvent.emit(name);
  }; // change Login Name

  public resetLogin(){
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("token");
    this.changeLoginName(null);
    this.LogoutEvent.emit(true);
  }; //reset Login

  public isLogin():boolean{
    let _name = sessionStorage.getItem("name");
    let _token = sessionStorage.getItem("token");
    console.log("login.isLogin: _name = ", _name);
    return (!!_name && !!_token);
  }; // isLogin
}
