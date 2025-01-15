import { Draggable } from "../interfaces/interfaces";
import { Project } from "../modules/project";
import { AutobindThis } from "../util/autobind";
import { Component } from "./base-component";

export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable{
    private project: Project;

    get persons(){
        return this.project.people === 1 ? '1 person' : `${this.project.people} people`
    }

    constructor(hostId: string, project: Project){
        super('single-project', hostId, "beforeend", project.id);
        this.project = project;

        this.configure();
        this.renderContent();
    }
    @AutobindThis
    dragStartHandler(event: DragEvent): void {
        event.dataTransfer!.setData('text/plain', this.project.id);
        event.dataTransfer!.effectAllowed = 'move';
    }

    dragEndHandler(_: DragEvent): void {
        console.log('DragEnd')
    }

    configure(){
        this.htmlElement.addEventListener('dragstart', this.dragStartHandler);
        this.htmlElement.addEventListener('dragend', this.dragEndHandler);
    }

    renderContent(){
        (this.htmlElement.querySelector('h2') as HTMLHeadingElement).textContent = this.project.title;
        (this.htmlElement.querySelector('h3') as HTMLHeadingElement).textContent = this.persons + ' assigned';
        (this.htmlElement.querySelector('p') as HTMLParagraphElement).textContent = this.project.description;
    }
};