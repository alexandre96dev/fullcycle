import Address from "./address";

export default class Customer {
    private _id: string;
    private _name: string;
    private _address!: Address;
    private _active: boolean = false;
    private _rewardPoints: number = 0;

    constructor(id: string, name: string){
        this._id = id;
        this._name = name;
        this.validate();
    }

    
    public get id() : string {
        return this._id
    }
    
    
    public get name() : string {
        return this._name
    }

    
    public get Address() : Address {
        return this._address
    }
    
    public get active(): boolean {
        return this._active;
    }

    public set id(id : string) {
        this._id = id;
    }
    
    public set name(name : string) {
        this._name = name;
    }
    
    public set Address(address : Address) {
        this._address = address;
    }

    public set active(active: boolean){
        this._active = active;
    } 

    
    public get rewardPoints() : number {
        return this._rewardPoints;
    }
    

    changeName(name: string){
        this._name = name;
    }

    changeAddress(address: Address){
        this._address = address;
    }

    activate(){
        if (this._address === undefined) {
            throw new Error("Address is mandatory")    
        }
        this._active = true;
    }

    deactivate(){
        this._active = false;
    }

    isActive(): boolean {
        return this._active
    }

    validate(){
        if(this._name.length === 0){
            throw new Error("Name required");
        }

        if (this._id.length === 0) {
            throw new Error("ID required");
        }
    }

    addRewardPoints(points: number){
        this._rewardPoints += points;
    }
}