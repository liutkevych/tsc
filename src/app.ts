enum ProjectStatus { Active, Finished }

class Project {
    constructor(
        public id: string, 
        public title: string, 
        public description: string, 
        public people: number, 
        public status: ProjectStatus
    ){}
}

type Listener<T> = (items: T[]) => void;

class State<T>{
    protected listeners: Listener<T>[] = [];

    addListnerer(listenerFn: Listener<T>){
        this.listeners.push(listenerFn);
    };
}
class ProjectState extends State<Project>{
    private projects: Project[] = [];
    private static instance: ProjectState;

    private constructor(){
        super()
    };

    static getInstance(){
        if(this.instance){
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    };

    addProject(title: string, description: string, numberOfPeople: number){
        const newProject = new Project(Math.random().toString(), title, description, numberOfPeople, ProjectStatus.Active);
        this.projects.push(newProject);
        for (const listenerFn of this.listeners){
            listenerFn(this.projects.slice()) // pass copy of projects but not themselves
        }
    };
}

const projectState = ProjectState.getInstance();
interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

function validate(validatableInput: Validatable){
    let isValid = true;
    if(validatableInput.required){
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }
    if(validatableInput.minLength != null && typeof validatableInput.value === 'string'){
        isValid = isValid && validatableInput.value.trim().length >= validatableInput.minLength;
    }
    if(validatableInput.maxLength != null && typeof validatableInput.value === 'string'){
        isValid = isValid && validatableInput.value.trim().length <= validatableInput.maxLength;
    }
    if( validatableInput.min != null && typeof validatableInput.value === 'number'){
        isValid = isValid && validatableInput.value >= validatableInput.min;
    }
    if( validatableInput.max != null && typeof validatableInput.value === 'number'){
        isValid = isValid && validatableInput.value <= validatableInput.max;
    }
    return isValid;
}

function AutobindThis(_1: any, _2: string, descriptor: PropertyDescriptor){
    const originalMethod = descriptor.value;
    const adjastedDescriptor: PropertyDescriptor = {
        configurable: true,
        enumerable: false,
        get(){
            return originalMethod.bind(this);
        }
    }
    return adjastedDescriptor;
};

type PositionToPlace  = 'afterbegin'| 'afterend' |'beforebegin'|'beforeend';

abstract class Component<T extends HTMLElement, U extends HTMLElement>{
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

}
class ProjectList extends Component <HTMLDivElement, HTMLElement>{
    assignedProjects: Project[] = [];
    constructor(private type: 'active' | 'finished'){
        super('project-list', 'app', 'beforeend', `${type}-projects`);
        this.assignedProjects = [];

        
        this.configure();
        this.renderContent();
    }
    
    configure(){
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

}
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement>{
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor(){
        super('project-input', 'app', 'afterbegin', 'user-input')

        this.titleInputElement = this.htmlElement.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.htmlElement.querySelector('#description') as HTMLInputElement;
        this.peopleInputElement = this.htmlElement.querySelector('#people') as HTMLInputElement;

        this.configure();
    }
    configure() {
        this.htmlElement.addEventListener('submit', this.submitHandler);
    }

    renderContent(){

    }

    private clearInputs(){
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }
    private gatherUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = +this.peopleInputElement.value;

        const titleValidatable: Validatable = {
            value: enteredTitle,
            required: true
        }
        const descriptionValidatable: Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 5
        }
        const peopleValidatable: Validatable = {
            value: enteredPeople,
            required: true,
            min: 1,
            max: 7
        }

        const isValid: Boolean =  
            validate(titleValidatable) &&
            validate(descriptionValidatable) &&
            validate(peopleValidatable);

        if (!isValid){
            alert('Invalid input, please try again');
            return;
        }
        return [enteredTitle, enteredDescription, enteredPeople];
    }

    @AutobindThis
    private submitHandler(event: Event){
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if(Array.isArray(userInput)){
            const [title, description, people] = userInput;
            console.log(title, description, people);
            projectState.addProject(title, description, people);
            this.clearInputs();
        }
    }

}

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement>{
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

    configure(){}

    renderContent(){
        (this.htmlElement.querySelector('h2') as HTMLHeadingElement).textContent = this.project.title;
        (this.htmlElement.querySelector('h3') as HTMLHeadingElement).textContent = this.persons + ' assigned';
        (this.htmlElement.querySelector('p') as HTMLParagraphElement).textContent = this.project.description;
    }
}

const prjInput = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');