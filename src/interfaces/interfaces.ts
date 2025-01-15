export interface Draggable {
    dragStartHandler(event: DragEvent): void;
    dragEndHandler(event: DragEvent): void;
}

export interface DragTarget {
    dragOverHandler(event: DragEvent): void;
    dropHandler(event: DragEvent): void;
    dragLeaveHandler(event: DragEvent): void;
}

export enum ProjectStatus { Active, Finished };

export interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
};

export type PositionToPlace  = 'afterbegin'| 'afterend' |'beforebegin'|'beforeend';

export class State<T>{
    protected listeners: Listener<T>[] = [];

    addListnerer(listenerFn: Listener<T>){
        this.listeners.push(listenerFn);
    };
};

export type Listener<T> = (items: T[]) => void;