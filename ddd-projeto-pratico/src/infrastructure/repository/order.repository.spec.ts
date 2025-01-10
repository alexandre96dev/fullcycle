import { Sequelize } from "sequelize-typescript";
import OrderModel from "../db/sequelize/model/order.model";
import CustomerModel from "../db/sequelize/model/customer.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import ProductModel from "../db/sequelize/model/product.model";
import CustomerRepository from "./customer.repository";
import Customer from "../../domain/entity/customer";
import Address from "../../domain/entity/address";
import ProductRepository from "./product.repository";
import Product from "../../domain/entity/product";
import OrderItem from "../../domain/entity/order_item";
import Order from "../../domain/entity/order";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {

    let sequelize: Sequelize;
    beforeEach(async () => {
        sequelize = new Sequelize({
            storage: ":memory:",
            dialect: "sqlite",
            logging: false,
            sync: { force: true },
        });
        
        sequelize.addModels([OrderModel, CustomerModel, OrderItemModel, ProductModel]);

        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create order", async () => {
        const customerRepository = new CustomerRepository();

        const customer = new Customer("123", "Customer 1")
        
        const address =  new Address("Street 1", 1, "Zip 1", "City 1");

        customer.changeAddress(address);

        await customerRepository.create(customer);


        const productRepository = new ProductRepository();

        const product = new Product("p1", "Product 1", 100);

        await productRepository.create(product);

        const orderItem = new OrderItem("1", product.name, product.price, 2, product.id);

        const orderRepository = new OrderRepository();

        const order = new Order("123", "123", [orderItem]);
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        })

        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "123",
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    product_id: "p1",
                    order_id: "123",
                }
            ]
        });
    });
})