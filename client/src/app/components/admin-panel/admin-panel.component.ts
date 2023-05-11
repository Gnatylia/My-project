import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProductModel } from 'src/app/models/product-model';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  @Output() updateProducts: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }
  
  public selectedProduct: ProductModel;

  public isWelcome: boolean = true;

  ngOnInit(): void {
  }

  openForm(item?: ProductModel) {
    console.log("AdminPanel: openForm");
    if(item){
      this.selectedProduct = item;
    }
    this.isWelcome = false;
  }

  closeForm() {
    console.log("AdminPanel: closeForm");
    //refresh Products
    this.updateProducts.emit();
    this.selectedProduct = null;
    this.isWelcome = true;
  }



}
