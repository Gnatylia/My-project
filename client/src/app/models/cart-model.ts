import { CartProductModel } from "./cart-product-model";

export class CartModel {
    _id?: string;
    id_user: string;
    date_create: Date;
    isClosed: boolean;
    items?: CartProductModel[];
}
