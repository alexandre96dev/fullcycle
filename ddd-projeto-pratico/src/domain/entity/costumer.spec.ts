import EventDispatcher from "../event/@shared/event-dispatcher"
import SendConsoleLog1Handler from "../event/costumer/handler/send-console-log-1-when-product-is-created.handler"
import SendConsoleLog2Handler from "../event/costumer/handler/send-console-log-2-when-product-is-created.handler"
import SendConsoleLogCostumerAddressIsChangedHandler from "../event/costumer/handler/send-console-log-when-costumer-address-is-changed.handler"
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

    it("should change costumer address and notify event handlers", ()=>{
        
        const eventDispatcher = new EventDispatcher();
        const eventHandler =  new SendConsoleLogCostumerAddressIsChangedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        const customer = new Customer("1", "customer 1");
        const address = new Address("Street 1", 123, "13330-250", "São Paulo");
        customer.Address = address;
        
        customer.activate();

        customer.changeAddress(new Address("Street 2", 123, "13330-250", "São Paulo"));

        eventDispatcher.register("ChangeCostumerAddressEvent", eventHandler);
        
        expect(eventDispatcher.getEventHandlers["ChangeCostumerAddressEvent"][0]).toMatchObject(eventHandler);    
        
        eventDispatcher.notify(customer.getEvents().values().next().value);

        expect(spyEventHandler).toHaveBeenCalled();
    });


    it("should create costumer and notify event handlers", ()=>{
        const eventDispatcher = new EventDispatcher();
        
        const eventHandler1 =  new SendConsoleLog1Handler();
        const eventHandler2 =  new SendConsoleLog2Handler();
        const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
        const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

        const customer = new Customer("123", "John");

        customer.create();

        eventDispatcher.register("CostumerCreatedEvent", eventHandler1);
        eventDispatcher.register("CostumerCreatedEvent", eventHandler2);

        expect(eventDispatcher.getEventHandlers["CostumerCreatedEvent"][0]).toMatchObject(eventHandler1);  
        expect(eventDispatcher.getEventHandlers["CostumerCreatedEvent"][1]).toMatchObject(eventHandler2);

        eventDispatcher.notify(customer.getEvents().values().next().value);

        expect(spyEventHandler1).toHaveBeenCalled();

        expect(spyEventHandler2).toHaveBeenCalled();
    });
})