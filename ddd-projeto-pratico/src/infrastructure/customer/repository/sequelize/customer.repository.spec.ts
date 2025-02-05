import { Sequelize } from "sequelize-typescript";
import CustomerModel from "./customer.model";
import CustomerRepository from "./customer.repository";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";

describe("Customer repository test", () => {

    let sequelize: Sequelize;
    beforeEach(async () => {
        sequelize = new Sequelize({
            storage: ":memory:",
            dialect: "sqlite",
            logging: false,
            sync: { force: true },
        });
        
        sequelize.addModels([CustomerModel]);

        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a customer", async () => {
        const customerRepository = new CustomerRepository(); 

        const customer = new Customer("1", "Customer 1");
        customer.changeAddress(new Address("Street 1", 1, "12345", "City 1"));

        await customerRepository.create(customer);

        const customerModel = await CustomerModel.findOne({ where: { id: "1" } });

        expect(customerModel.toJSON()).toStrictEqual({
            id: "1",
            name: "Customer 1",
            street: "Street 1",
            number: 1,
            zipcode: "12345",
            city: "City 1",
            active: false,
            rewardPoints: 0,
        });
    });

    it("should update a customer", async () => {
        const customerRepository = new CustomerRepository();

        const customer = new Customer("1", "Customer 1");
        customer.changeAddress(new Address("Street 1", 1, "12345", "City 1"));

        await customerRepository.create(customer);

        customer.changeName("Customer 2");
        customer.changeAddress(new Address("Street 2", 2, "54321", "City 2"));

        await customerRepository.update(customer);

        const customerModel = await CustomerModel.findOne({ where: { id: "1" } });

        expect(customerModel.toJSON()).toStrictEqual({
            id: "1",
            name: "Customer 2",
            street: "Street 2",
            number: 2,
            zipcode: "54321",
            city: "City 2",
            active: false,
            rewardPoints: 0,
        });
    });

    it("should find a customer", async () => {
        const customerRepository = new CustomerRepository();

        const customer = new Customer("1", "Customer 1");
        customer.changeAddress(new Address("Street 1", 1, "12345", "City 1"));

        await customerRepository.create(customer);

        const foundCustomer = await customerRepository.find("1");

        expect(foundCustomer.id).toBe("1");
        expect(foundCustomer.name).toBe("Customer 1");
        expect(foundCustomer.Address.street).toBe("Street 1");
        expect(foundCustomer.Address.number).toBe(1);
        expect(foundCustomer.Address.zip).toBe("12345");
        expect(foundCustomer.Address.city).toBe("City 1");
    });

    it("should throw an error when customer not found", async () => {
        const customerRepository = new CustomerRepository();

        await expect(customerRepository.find("1")).rejects.toThrow("Customer not found");
    });

    it("should find all customers", async () => {
        const customerRepository = new CustomerRepository();

        const customer1 = new Customer("1", "Customer 1");
        customer1.changeAddress(new Address("Street 1", 1, "12345", "City 1"));

        await customerRepository.create(customer1);


        const customer2 = new Customer("2", "Customer 2");
        customer2.changeAddress(new Address("Street 2", 2, "54321", "City 2"));
        
        await customerRepository.create(customer2);

        const customers = await customerRepository.findAll();

        expect(customers.length).toBe(2);
        expect(customers[0].id).toBe("1");
        expect(customers[0].name).toBe("Customer 1");
        expect(customers[0].Address.street).toBe("Street 1");
        expect(customers[0].Address.number).toBe(1);
        expect(customers[0].Address.zip).toBe("12345");
        expect(customers[0].Address.city).toBe("City 1");

        expect(customers[1].id).toBe("2");
        expect(customers[1].name).toBe("Customer 2");
        expect(customers[1].Address.street).toBe("Street 2");
        expect(customers[1].Address.number).toBe(2);
        expect(customers[1].Address.zip).toBe("54321");
        expect(customers[1].Address.city).toBe("City 2");
    });
})