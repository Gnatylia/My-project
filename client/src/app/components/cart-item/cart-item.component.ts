import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CartProductModel } from 'src/app/models/cart-product-model';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent implements OnInit {

  @Output() onRemove: EventEmitter<string> = new EventEmitter<string>();
  @Input() itemCart: CartProductModel

  @Input() state: string; // edit | view

  constructor() { }

  ngOnInit(): void {
  }

  public removeProduct(cartItemID: string) {
    this.onRemove.emit(cartItemID);
  }

}
