export interface IResponseModel {
    err: boolean;
    msg: string;    
    token: string;
    role: string;
    result: any; // any data
}
