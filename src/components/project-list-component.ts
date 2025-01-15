import { DragTarget, ProjectStatus } from "../interfaces/interfaces";
import { Project } from "../modules/project";
import { projectState } from "../state/project-state";
import { AutobindThis } from "../util/autobind";
import { Component } from "./base-component";
import { ProjectItem } from "./project-item-component";

export 
class ProjectList extends Component <HTMLDivElement, HTMLElement> implements DragTarget{
    assignedProjects: Project[] = [];
    constructor(private type: 'active' | 'finished'){
        super('project-list', 'app', 'beforeend', `${type}-projects`);
        this.assignedProjects = [];

        
        this.configure();
        this.renderContent();
    }

    @AutobindThis
    dragOverHandler(event: DragEvent): void {
        if(event.dataTransfer && event.dataTransfer.types[0] === 'text/plain'){
            event.preventDefault();
            const listEl = this.htmlElement.querySelector('ul')!;
            listEl.classList.add('droppable');
        }
    }
    @AutobindThis
    dropHandler(event: DragEvent): void {
        const prjId = event.dataTransfer!.getData('text/plain');
        projectState.moveProject(prjId, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished)
    };
    @AutobindThis
    dragLeaveHandler(_: DragEvent): void {
        const listEl = this.htmlElement.querySelector('ul')!;
        listEl.classList.remove('droppable');
    };
    
    configure(){
        this.htmlElement.addEventListener('dragover', this.dragOverHandler);
        this.htmlElement.addEventListener('drop', this.dropHandler);
        this.htmlElement.addEventListener('dragleave', this.dragLeaveHandler);
        projectState.addListnerer((projects: Project[]) => {
            const relevantProjects = projects.filter(item => {
                if(this.type === 'active'){
                    return item.status === ProjectStatus.Active;
                }
                return item.status === ProjectStatus.Finished
            })
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        })
    }

    renderContent(){
        const listId = `${this.type}-projects-list`;
        (this.htmlElement.querySelector('ul') as HTMLUListElement).id = listId;
        (this.htmlElement.querySelector('h2') as HTMLHeadingElement).textContent = this.type.toUpperCase() + ' PROJECTS';
    }

    private renderProjects(){
        const listEl = document.getElementById(`${this.type}-projects-list`) as HTMLUListElement;
        listEl.innerHTML = '';
        for(const prjItem of this.assignedProjects){
            new ProjectItem(this.htmlElement.querySelector('ul')!.id, prjItem);
        }
    }

};