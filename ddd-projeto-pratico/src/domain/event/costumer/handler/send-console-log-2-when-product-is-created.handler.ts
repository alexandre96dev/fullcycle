import EventHandlerInterface from "../../@shared/event-handler.interface";
import CostumerCreatedEvent from "../costumer-created.event";

export default class SendConsoleLog2Handler implements EventHandlerInterface<CostumerCreatedEvent> {
    handle(event: CostumerCreatedEvent): void {
        console.log("Esse é o segundo console.log do evento: CustomerCreated");
    }
}