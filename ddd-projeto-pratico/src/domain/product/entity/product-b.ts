import ProductInterface from "./product.interface";

export default class Product implements ProductInterface {
    private readonly _id: string;
    private _name: string;
    private _price: number;

    constructor(id: string, name: string, price: number){
        this._id = id;
        this._name = name;
        this._price = price;

        this.validate();
    }

    validate(){
        if(this._id.length === 0){
            throw new Error("ID is required");
        }

        if(this._name.length === 0){
            throw new Error("Name is required");
        }

        if(this._price < 0){
            throw new Error("Price must be greater than zero");
        }

        return true
    }

    
    get name() : string {
        return this._name
    }
    
    changeName(name: string): void{
        this._name = name;
        this.validate()
    }

    changePrice(price: number): void {
        this._price = price;
        this.validate()
    }

    get price() : number {
        return this._price * 2;
    }
    
    get id() : string {
        return this._id
    }

}