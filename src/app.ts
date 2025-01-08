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

    @AutobindThis
    private submitHandler(event: Event){
        event.preventDefault();
        console.log(this.titleInputElement.value);
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