import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";


export default class OrderRepository implements OrderRepositoryInterface {
  async update(entity: Order): Promise<void> {
    await OrderModel.update(
      {
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        where: { id: entity.id },
      });
  }

  async find(id: string): Promise<Order> {
    const foundOrder = await OrderModel.findOne({
      where: { id },
      include: [{ model: OrderItemModel }],
    });
    if (!foundOrder) {
      throw new Error("Order not found");
    }
    const items = foundOrder.items.map((item) => {
      return new OrderItem(
        item.id,
        item.name,
        item.price / item.dataValues.quantity,
        item.quantity,
        item.product_id
      );
    });
    return new Order(foundOrder.id, foundOrder.customer_id, items);
  }

  async findAll(): Promise<Order[]> {
    const foundOrders = await OrderModel.findAll({
      include: [{ model: OrderItemModel }],
    });
    return foundOrders.map((order) => {
      const items = order.items.map((item) => {
        return new OrderItem(
          item.id,
          item.name,
          item.price / item.dataValues.quantity,
          item.quantity,
          item.product_id
        );
      });
      return new Order(order.id, order.customer_id, items);
    });
  }
  

  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }
}
