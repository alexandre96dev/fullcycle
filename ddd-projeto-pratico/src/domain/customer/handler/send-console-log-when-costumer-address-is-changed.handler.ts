
import EventHandlerInterface from "../../@shared/event/event-handler.interface";
import ChangeCostumerAddressEvent from "../changed-costumer-address.event";

export default class SendConsoleLogCostumerAddressIsChangedHandler implements EventHandlerInterface<ChangeCostumerAddressEvent> {
    handle(event: ChangeCostumerAddressEvent): void {
        console.log(`Endereço do cliente: ${event.eventData.id}, ${event.eventData.name} alterado para: ${event.eventData.address}`);
    }
}