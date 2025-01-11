export default class OrderItem{
   private readonly _id: string;
   private readonly _name: string;
   private readonly _price: number;
   private readonly _quantity: number;
   private readonly _productId: string;

    constructor(id: string, name: string, price: number, quantity: number, productId: string){
        this._id = id;
        this._name = name;
        this._price = price;
        this._quantity = quantity;
        this._productId = productId;
    }
    
    public get price() : number {
        return this._price * this._quantity
    }
    
    orderItemTotal(): number {
        return this._price * this._quantity;
    }
    
    public get quantity() : number {
        return this._quantity;
    }

    get id(): string { 
        return this._id; 
    }

    get name(): string { 
        return this._name; 
    }

    get productId(): string { 
        return this._productId; 
    }
}