import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryModel } from 'src/app/models/category-model';
import { ProductModel } from 'src/app/models/product-model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-form-product',
  templateUrl: './form-product.component.html',
  styleUrls: ['./form-product.component.css']
})
export class FormProductComponent implements OnInit {

  @Input() product: ProductModel;
  @Output() onSavedProduct: EventEmitter<any> = new EventEmitter<any>();

  selectedFileName: string;
  selectedFile: any;
  public categories: CategoryModel[] = [];
  public myForm: FormGroup;
  buttonName: string = "Save";


  constructor(
    private _fb: FormBuilder,
    private _service: ProductService,
    private _r: Router
  ) { }

  ngOnInit(): void {
    this.myForm = this._fb.group({
      name: ["", Validators.required],
      price: ["", Validators.required],
      img: ["", Validators.required],
      id_category: ["", Validators.required]
    });
    this.getCategories();
   
    if (this.product) {
      // 1. fill fields
      this.myForm.setValue({
        name: this.product.name,
        price: this.product.price,
        id_category: this.product.id_category,
        img: this.product.img
      });
      this.buttonName = "Update";
      //console.log("FormProduct.ngOnInit.myForm.setValue: product = ",
      // this.product);
    } else {
      console.log("Dont have product")
    }
  }

  public handle_submit() {
    console.log('handle_submit:');
    if (this.myForm.invalid) {
      console.warn('handle_submit: form not valid!');
      return;
    }

    if (this.product) { // update
      console.log("handleSubmit.changesProduct: Input.product= ", this.product);
      const { _id, name, price, img, id_category } = this.myForm.value;
      let _product: ProductModel = {
        _id: this.product._id,
        name: name,
        price: price,
        img: this.product.img,
        id_category: id_category
      };
      console.log("handle_submit: _product = ", _product);
      this.updateProductToServer(_product);
      console.log("changesProduct: this.product= ", this.product);

    } else { // new 
      this.addProductWithImg(this.selectedFile);
    }

  }; //handle_submit

  fileChanged(e) {
    console.log('fileChange: file = ', e.target.files[0]);
    this.selectedFile = e.target.files[0];//.name;
    this.selectedFileName = this.selectedFile.name;
    let _imgValue = this.myForm.value["img"];
    console.log('fileChange: _imgValue = ', _imgValue);
  }; // fileChanged

  public getCategories() {
    this._service.getAllCategories().subscribe(
      (res) => {
        if (res.result) {
          this.categories = res.result;
          console.log("getCategories: categories = ", this.categories);
        }
      }, err => {
        console.log(err);
      }
    )
  };//getCategories

  public updateProductToServer(product: ProductModel) {
    console.log("Form-Product.changesProduct: product = ", product);
    this._service.updateProduct(product).subscribe(
      (result) => {
        console.log("Form-Product.changesProduct: result = ", result);
        this.closeForm();
      }, err => {
        console.log(err.error);
      }
    )
  }; // Update Product To server


  closeForm() {
    this.onSavedProduct.emit();
  }; // closeForm

  public saveProduct(product: ProductModel) {
    this._service.addProduct(product).subscribe(
      (result) => {
        console.log(result);
        // check response
        // close form
        this.closeForm();
      }, err => {
        console.log(err.error);
      }
    ) // subscribe add product
  };// saveProduct

  public addProductWithImg(selectedFile: any) {

    const formData = new FormData();
    formData.append("img", selectedFile);

    this._service.uploadImage(formData).subscribe(res => {
      if (res.err) {
        console.warn('handle_submit: Error = ', res.msg);
      } else {
        console.log('handle_submit: result = ', res.result);
        const { name, price, img, id_category } = this.myForm.value;
        let _product: ProductModel = {
          name: name,
          price: price,
          img: res.result,
          id_category: id_category
        };
        console.log("handle_submit: _product = ", _product);
        this.saveProduct(_product);
      }
    }, err => console.error('handle_submit: request-error = ', err)
    ); // upload Image 
  };// addProductWithImg
}
