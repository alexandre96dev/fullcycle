import Address from "./address"
import Customer from "./customer"

describe("Customer unit tests", ()=> {
    it("Should throw error when id is empty", ()=>{
        expect(() => {
            let customer = new Customer("", "John")
        }).toThrow(Error("ID required"))
    })

    it("Should throw error when name is empty", ()=>{
        expect(() => {
            let customer = new Customer("123", "")
        }).toThrow(Error("Name required"))
    })

    it("Should change name", ()=>{
        const customer = new Customer("123", "John");
        customer.changeName("Jane");

        expect(customer.name).toBe("Jane");
    })


    it("Should activate customer", ()=>{
        const customer = new Customer("1", "customer 1");
        const address = new Address("Street 1", 123, "13330-250", "São Paulo");
        customer.Address = address;

        customer.activate()

        expect(customer.isActive()).toBe(true);
    })


    it("Should deactivate customer", ()=>{
        const customer = new Customer("1", "customer 1");
        const address = new Address("Street 1", 123, "13330-250", "São Paulo");
        customer.Address = address;

        customer.deactivate()

        expect(customer.isActive()).toBe(false);
    })


    it("Should throw error when address is undefined when you activate a customer", ()=>{

        expect(()=>{
            const customer = new Customer("1", "customer 1")
            customer.activate();    
        }).toThrow(Error("Address is mandatory"))
    })

    it("should add reward points", () => {
        const customer = new Customer("1", "Customer 1");
        expect(customer.rewardPoints).toBe(0);
        
        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(10)

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(20)
    })
})