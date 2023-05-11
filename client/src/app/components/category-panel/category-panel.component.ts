import { Component, EventEmitter, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { CategoryModel } from 'src/app/models/category-model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-category-panel',
  templateUrl: './category-panel.component.html',
  styleUrls: ['./category-panel.component.css']
  //, encapsulation: ViewEncapsulation.None
})
export class CategoryPanelComponent implements OnInit, AfterViewInit {

  @ViewChild("tabsgroup") tabsgroup: MatTabGroup;

  @Output() selectCategory: EventEmitter<number> = new EventEmitter<number>();
  @Output() onLogout: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private _service: ProductService
  ) { }

  public categories: CategoryModel[] = []

  ngOnInit(): void {
    this.getCategories();
  }

  ngAfterViewInit(): void {
    console.log("CategoryPanel.ngAfterViewInit: selectedIndex = ", this.tabsgroup.selectedIndex);
  };// ngAfterViewInit

  public getCategories() {
    this._service.getAllCategories().subscribe(
      (result) => {
        this.categories = result.result
        console.log("getCategories:categories = ", this.categories)
      }, error => {
        console.log("getCategories: error.status = ", error.status);
        if (error.status == 401) {
          this.onLogout.emit();
        }
      }
    )
  }; // getCategories

  onSelect(arg) {
    console.log('CategoryPanel.onSelect: arg = ', arg.tab);
    let _label = arg.tab.textLabel;
    let _catID = parseInt(arg.tab.ariaLabel);
    //console.log('CategoryPanel.onSelect: arg = ', { _label, _catID });

    if (!isNaN(_catID)) {
      this.selectCategory.emit(_catID);
    } else {
      console.log("ariaLabel not number");
    }
  }; // onSelect

}
