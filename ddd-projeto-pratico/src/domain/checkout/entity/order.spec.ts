
import Order from "./order"
import OrderItem from "./order_item"


describe("Order unit tests", ()=> {
    it("Should throw error when id is empty", ()=>{
        expect(() => {
            let order = new Order("", "123", [])
        }).toThrow(Error("ID required"))
    })

    it("Should throw error when customerId is empty", ()=>{
        expect(() => {
            let order = new Order("123", "", [])
        }).toThrow(Error("customerId required"))
    })

    it("Should throw error when customerId is empty", ()=>{
        expect(() => {
            let order = new Order("123", "", [])
        }).toThrow(Error("customerId required"))
    })

    it("Should throw error when customerId items is empty", ()=>{
        expect(() => {
            let order = new Order("123", "123", [])
        }).toThrow(Error("Items required"))
    })

    it("Should calculate total", ()=>{
        const item1 = new OrderItem("i1", "Item 1", 100, 2, "p1");
        const item2 = new OrderItem("i2", "Item 2", 200, 2, "p2");
        const order = new Order("o1", "c1", [item1]);

        let total = order.total()

        expect(total).toBe(200)

        const order2 = new Order("o1", "c1", [item1, item2]);
        total = order2.total();
        expect(total).toBe(600)
    })

    it("Should check if the item qtd is less or equal zero", ()=>{
        expect(() => {
            const item1 = new OrderItem("i1", "Item 1", 100, 0, "p1");
            const order = new Order("o1", "c1", [item1]);
        }).toThrow(Error("Quantity must be greater than 0"))
    })
})