import { Validatable } from "../interfaces/interfaces";
import { projectState } from "../state/project-state";
import { AutobindThis } from "../util/autobind";
import { validate } from "../util/validate";
import { Component } from "./base-component";

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement>{
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

};