import { ProductModel } from "./product-model";

export class CartProductModel extends ProductModel {
    // _id - inherit from ProductModel
    amount: number;
    id_cart: string;
    id_product: string;
    origin_price: number;
    mark?:string = "";

    /**
     *
     */
    constructor(model?: ProductModel) {
        super();

        if (model) {
            this.id_product = model._id;
            this.name = model.name;
            this.origin_price = model.price;
            this.img = model.img;
            this.id_category = model.id_category;
        }
    }
}
