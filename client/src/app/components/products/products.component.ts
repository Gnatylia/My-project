import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductModel } from 'src/app/models/product-model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  @Input() items: ProductModel[];
  @Output() onProductSelected: EventEmitter<ProductModel> = new EventEmitter<ProductModel>();

  constructor(
    private _service: ProductService,
    private _r: Router
  ) { }

  public selectedProduct(productID: string) {
    console.log('Products.selectedProduct: productID = ', productID);
    //get item by ID
    let item = this.items.find(product => product._id == productID);
    console.log("Products.selectedProduct: item = ", item);
    this.onProductSelected.emit(item);
  }

  ngOnInit(): void {
  }


}
