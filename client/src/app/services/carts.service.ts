import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IResponseModel } from '../interfaces/iresponse-model';
import { CartProductModel } from '../models/cart-product-model';

@Injectable({
  providedIn: 'root'
})
export class CartsService {

  constructor(
    private http: HttpClient,
    private _r: Router
  ) { }

  public newCart(): Observable<IResponseModel> {
    return this.http.get("http://localhost:4000/cartes/new",
      {
        headers: { 'token': sessionStorage.token }
      }) as Observable<IResponseModel>;
  };  // Get New Cart 

  public currentCart(): Observable<IResponseModel> {
    return this.http.get("http://localhost:4000/cartes/current",
      {
        headers: { 'token': sessionStorage.token }
      }) as Observable<IResponseModel>;
  }; // Get Current Cart

  public addCartItem(cartItem: CartProductModel): Observable<IResponseModel> {
    return this.http.post(
      "http://localhost:4000/cartes/product",
      cartItem,
      {
        headers: {
          'Content-Type': 'application/json',
          'token': sessionStorage.token
        }
      }) as Observable<IResponseModel>
  }; // add Cart Item (product)

  public deleteCart(cartID: string): Observable<IResponseModel> {
    return this.http.delete("http://localhost:4000/cartes/" + cartID,
      {
        headers: { 'token': sessionStorage.token }
      }) as Observable<IResponseModel>
  }; // Delete  All Cart

  public deleteCartItem(cartItemID: string): Observable<IResponseModel> {
    return this.http.delete("http://localhost:4000/cartes/product/" + cartItemID,
      {
        headers: { 'token': sessionStorage.token }
      }) as Observable<IResponseModel>
  }; // Delete Cart Item 
  
  public userDetails(): Observable<IResponseModel> {
    return this.http.get("http://localhost:4000/cartes/userDetails", 
    {
      headers: { 'token': sessionStorage.token }
    }) as Observable<IResponseModel>
  }; // Get User Details

}
