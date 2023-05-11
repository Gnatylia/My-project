import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IResponseModel } from '../interfaces/iresponse-model';
import { OrderModel } from '../models/order-model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private http: HttpClient,
    private _r: Router
  ) { }

  public getOrders(): Observable<IResponseModel> {
    return this.http.get("http://localhost:4000/order",
      {
        headers: { 'token': sessionStorage.token }
      }) as Observable<IResponseModel>;
  }; // get orders

  public getCountOrders(): Observable<IResponseModel> {
    return this.http.get("http://localhost:4000/order/count"
    )as Observable<IResponseModel>;
  }; // get count orders

  public createOrder(order: OrderModel): Observable<IResponseModel> {
    return this.http.post("http://localhost:4000/order",
      order,
      {
        headers: { 'token': sessionStorage.token }
      }) as Observable<IResponseModel>;
  }; // post create order

  public getClosedDates(): Observable<IResponseModel> {
    return this.http.get("http://localhost:4000/order/closedDates",
      {
        headers: { 'token': sessionStorage.token }
      }) as Observable<IResponseModel>;
  }; // post create order

}
