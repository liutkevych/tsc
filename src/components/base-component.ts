import { PositionToPlace } from "../interfaces/interfaces";

export abstract class Component<T extends HTMLElement, U extends HTMLElement>{
    templateEment: HTMLTemplateElement;
    hostElement: T;
    htmlElement: U;
    constructor(templateid: string, hostElementId: string, position: PositionToPlace, newElementId?: string){
        this.templateEment = document.getElementById(templateid) as HTMLTemplateElement;
        this.hostElement =  document.getElementById(hostElementId) as T;
        const importedNode = document.importNode(this.templateEment.content, true);
        this.htmlElement = importedNode.firstElementChild as U;
        if(newElementId){
            this.htmlElement.id = newElementId;
        }

        this.attach(position);
    }

    attach(position: PositionToPlace){
        this.hostElement.insertAdjacentElement(position, this.htmlElement);
    }

    abstract configure(): void;
    abstract renderContent(): void;

};