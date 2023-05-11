import { LoginModel } from "./login-model";

export class UserModel extends LoginModel {
    id: string;
    firstName: string;
    lastName: string;
    city: string;
    street: string;
}
