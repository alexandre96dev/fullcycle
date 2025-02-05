import { Sequelize } from "sequelize-typescript";
import OrderRepository from "./order.repository";
import OrderModel from "./order.model";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import ProductModel from "../../../product/repository/sequelize/product.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import Product from "../../../../domain/product/entity/product";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Order from "../../../../domain/checkout/entity/order";
import OrderItemModel from "./order-item.model";

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


    it("should find all orders", async () => {
        const customerRepository = new CustomerRepository();

        const customer = new Customer("123", "Customer 1");
        const address =  new Address("Street 1", 1, "Zip 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);
        
        const productRepository = new ProductRepository();

        const product = new Product("p1", "Product 1", 100);

        await productRepository.create(product);

        const product2 = new Product("p2", "Product 2", 200);

        await productRepository.create(product2);

        const orderItem = new OrderItem("1", product.name, product.price, 2, product.id);

        const orderItem2 = new OrderItem("2", product2.name, product2.price, 2, product2.id);
        
        const orderRepository = new OrderRepository();

        const order = new Order("123", "123", [orderItem, orderItem2]);

        await orderRepository.create(order);

        const orders = await orderRepository.findAll();

        expect(orders).toStrictEqual([order]);
    });


    it("should find order", async () => {
        const customerRepository = new CustomerRepository();

        const customer = new Customer("123", "Customer 1");
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

        const orders = await orderRepository.find("123");

        expect(orders).toStrictEqual(order);
    });

    it("should throw error when order not found", async () => {
        const orderRepository = new OrderRepository();

        await expect(orderRepository.find("123")).rejects.toThrow("Order not found");
    });

    it("should update order", async () => {
        const customerRepository = new CustomerRepository();

        const customer = new Customer("123", "Customer 1");
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

        product.changeName("Product 2");

        const orderItemUpdated = new OrderItem("2", product.name, product.price, 2, product.id);

        const updatedOrder = new Order("123", "123", [orderItemUpdated]);

        await orderRepository.update(updatedOrder);

        const findUpdatedOrder = await orderRepository.find(order.id);

        expect(findUpdatedOrder).toStrictEqual(order);
    }); 
})