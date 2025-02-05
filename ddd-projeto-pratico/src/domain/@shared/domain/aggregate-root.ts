import EventInterface from "../event/event.interface";


export abstract class AggregateRoot{
    events: Set<EventInterface> = new Set();

    addEvent(event: EventInterface){
        this.events.add(event);
    }   

    clearEvents(){
        this.events.clear();
    }

    getEvents(): Set<EventInterface>{
        return this.events;
    }
}