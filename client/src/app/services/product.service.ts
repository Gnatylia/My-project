import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IResponseModel } from '../interfaces/iresponse-model';
import { ProductModel } from '../models/product-model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private Cache: any = {}; // Cache["categories"]
  public SearchProduct: EventEmitter<string> = new EventEmitter();

  constructor(
    private http: HttpClient,
    private _r: Router
  ) { }

  public uploadImage(form: any): Observable<IResponseModel> {
    return this.http.post("http://localhost:4000/product/upload", form, {
      headers: {
        'token': sessionStorage.token
      }
    }) as Observable<IResponseModel>;
  };

  public addProduct(product: ProductModel): Observable<IResponseModel> {
    return this.http.post(
      "http://localhost:4000/product/addProduct",
      product,
      {
        headers: {
          'Content-Type': 'application/json',
          'token': sessionStorage.token
        }
      }) as Observable<IResponseModel>;
  }; //addProduct

  public getProductByCategoryId(categoryID: number): Observable<IResponseModel> {
    return this.http.get("http://localhost:4000/product/" + categoryID,
      {
        headers: { 'token': sessionStorage.token }
      }) as Observable<IResponseModel>;
  }; // getProductByCategoryId

  public getAllCategories(): Observable<IResponseModel> {
    return new Observable(observer => {
      let _result = Cache["categories"] as IResponseModel;
      if (_result) {
        observer.next(_result);
      } else {
        this.http.get("http://localhost:4000/product/categories",
          {
            headers: { 'token': sessionStorage.token }
          }).subscribe((response: IResponseModel) => {
            Cache["categories"] = response;
            observer.next(response);
          },
            error => {
              console.warn("getAllCategories: err = ", error);
              observer.error(error);
            });
      }
    });
  }; // getAllCategories

  public updateProduct(product: ProductModel): Observable<IResponseModel> {
    return this.http.put(
      "http://localhost:4000/product/",
      product,
      {
        headers: {
          'Content-Type': 'application/json',
          'token': sessionStorage.token
        }
      }) as Observable<IResponseModel>;
  }; // update Product

  public getProductByTerm(term: string): Observable<IResponseModel> {
    return this.http.get("http://localhost:4000/product/search/" + term,
      {
        headers: { 'token': sessionStorage.token }
      }
    ) as Observable<IResponseModel>;
  }; // get product by term

  public search(term: string) {
    this.SearchProduct.emit(term);
  }; // search product

  public getCountProducts(): Observable<IResponseModel> {
    return this.http.get("http://localhost:4000/product/count/products"
    ) as Observable<IResponseModel>;
  }; // get count products
}
