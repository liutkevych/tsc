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

type Listener = (items: Project[]) => void;

class ProjectState {
    private listeners: Listener[] = [];
    private projects: Project[] = [];
    private static instance: ProjectState;

    private constructor(){

    };

    static getInstance(){
        if(this.instance){
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    };

    addListnerer(listenerFn: Listener){
        this.listeners.push(listenerFn);
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

class ProjectLIst {
    templateEment: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    htmlElement: HTMLElement;
    assignedProjects: Project[] = [];
    constructor(private type: 'active' | 'finished'){
        this.templateEment = document.getElementById('project-list') as HTMLTemplateElement;
        this.hostElement =  document.getElementById('app') as HTMLDivElement;
        this.assignedProjects = [];

        const importedNode = document.importNode(this.templateEment.content, true);
        this.htmlElement = importedNode.firstElementChild as HTMLElement;
        this.htmlElement.id = `${this.type}-projects`;

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

        this.attach();
        this.renderContent();
    }

    private renderProjects(){
        const listEl = document.getElementById(`${this.type}-project-list`) as HTMLUListElement;
        listEl.innerHTML = '';
        for(const prjItem of this.assignedProjects){
            const listItem = document.createElement('li');
            listItem.textContent = prjItem.title;
            listEl.appendChild(listItem);
        }
    }

    private renderContent(){
        const listId = `${this.type}-project-list`;
        (this.htmlElement.querySelector('ul') as HTMLUListElement).id = listId;
        (this.htmlElement.querySelector('h2') as HTMLHeadingElement).textContent = this.type.toUpperCase() + ' PROJECTS';
    }

    private attach(){
        this.hostElement.insertAdjacentElement('beforeend', this.htmlElement);
    }
}
class ProjectInput {
    templateEment: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    formElement: HTMLFormElement;
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor(){
        this.templateEment = document.getElementById('project-input') as HTMLTemplateElement;
        this.hostElement = document.getElementById('app') as HTMLDivElement;

        const importedNode = document.importNode(this.templateEment.content, true);
        // importNode method creates a copy of a Node or DocumentFragment from another document, 
        // to be inserted into the current document later
        this.formElement = importedNode.firstElementChild as HTMLFormElement;
        // firstElementChild is a read-only property returns the document's first child Element, 
        // or null if there are no child elements.
        this.formElement.id = 'user-input';

        this.titleInputElement = this.formElement.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.formElement.querySelector('#description') as HTMLInputElement;
        this.peopleInputElement = this.formElement.querySelector('#people') as HTMLInputElement;

        this.configure();
        this.attach();
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
    private configure() {
        this.formElement.addEventListener('submit', this.submitHandler);
    }

    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.formElement);
        // insertAdjacentElement() method of the Element interface inserts a given element node at 
        // a given position relative to the element it is invoked upon.
    }
}

const prjInput = new ProjectInput();
const activePrjList = new ProjectLIst('active');
const finishedPrjList = new ProjectLIst('finished');