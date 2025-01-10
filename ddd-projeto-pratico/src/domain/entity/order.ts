import OrderItem from "./order_item";

export default class Order {
    private readonly _id: string;
    private readonly _customerId: string;
    private readonly _items: OrderItem[];
    private readonly _total: number;

    constructor(id: string, customerId: string, items: OrderItem[]){
        this._id = id;
        this._customerId = customerId;
        this._items = items;
        this._total = this.total()
        this.validate()
    }

    total(): number {
        return this._items.reduce((acc, item) => acc + item.orderItemTotal(), 0);
      }

    validate() {
        const validations = [
            { condition: this._id.length === 0, message: "ID required" },
            { condition: this._customerId.length === 0, message: "customerId required" },
            { condition: this._items.length === 0, message: "Items required" },
            { condition: this._items.some(item => item.quantity <= 0), message: "Quantity must be greater than 0" }
        ];
    
        for (const validation of validations) {
            if (validation.condition) {
                throw new Error(validation.message);
            }
        }
        
        return true;
    }

    get id(): string {
        return this._id;
    }

    get customerId(): string {
        return this._customerId;
    }

    get items(): OrderItem[] {
        return this._items;
    }
}