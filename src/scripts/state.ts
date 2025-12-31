import {Draggable, Tier} from "./constants";

type StateItem<T> = T & { id: string }

interface StateAddSubscription<T> {
    type: "add"
    callback: (id: string, data: T) => void
}

interface StateUpdateSubscription<T> {
    type: "update"
    callback: (id: string, data: T) => void
}

interface StateRemoveSubscription {
    type: "remove"
    callback: (id: string) => void
}

type StateSubscription<T> = StateAddSubscription<T> | StateUpdateSubscription<T> | StateRemoveSubscription

export class State<T> {
    items: StateItem<T>[] = []
    subscriptions: StateSubscription<T>[] = []

    subscribe(subscription: StateSubscription<T>) {
        this.subscriptions.push(subscription)
    }

    add = (data: T) => {
        const id = crypto.randomUUID()
        this.items.push({id, ...data})
        this.subscriptions.forEach((subscription) => {
            if (subscription.type === "add") {
                subscription.callback(id, data)
            }
        })
    }

    update = (id: string, data: T) => {
        const index = this.items.findIndex((item) => item.id === id)
        if (index === -1) {
            return
        }

        this.items[index] = {id, ...data}
        this.subscriptions.forEach((subscription) => {
            if (subscription.type === "update") {
                subscription.callback(id, data)
            }
        })
    }

    remove = (id: string) => {
        const index = this.items.findIndex((item) => item.id === id)
        if (index === -1) {
            return
        }

        this.items.splice(index, 1)
        this.subscriptions.forEach((subscription) => {
            if (subscription.type === "remove") {
                subscription.callback(id)
            }
        })
    }
}

export const tierState = new State<Tier>()
export const draggableState = new State<Draggable>()