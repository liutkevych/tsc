// Decorator Factory function
function Logger(logString: string) {
    return function(constructor: Function){
        console.log(logString);
        console.log(constructor);
    }
};

function WithTemplate(template: string, hookId: string){
    return function<T extends {new(...args: any[]):{name: string}}>(originalConstructor: T){
        return class extends originalConstructor {
            constructor(..._: any[]){
                super();
                console.log('Rendering template')
                const hookEl = document.getElementById(hookId);
                if(hookEl){
                    hookEl.innerHTML = template;
                    hookEl.querySelector('h1')!.textContent = this.name;
                }

            }
        }
    }
}

// Creation of decorator function will be in common order (from top to bottom)
// but their execution will be ordered form bottom to top!!!
@Logger('Logging - Person')
@WithTemplate('<h1>My Person Object</h1>', 'app')
class CustomPerson {
    name = 'Max';
    constructor(){
        console.log('Creating person object ...');
    }
};

console.log('Decorator will be executed first as it happenes after it is defined, not instantiated!!')
const pers = new CustomPerson();

// --- 

// All these decorators are executing during class defenition
// Log2 (Accessor decorator) and Log3 (Method decorator) also might return something!

function Log(target: any, propertyName: string | Symbol){
    console.log('Property decorator!');
    console.log(target, propertyName)
}

function Log2(target: any, name: string, propertyDescriptor: PropertyDescriptor){
    console.log('Accessor decorator!');
    console.log(target);
    console.log(name);
    console.log(propertyDescriptor);
}

function Log3(target: any, name: string | Symbol, propertyDescriptor: PropertyDescriptor): PropertyDescriptor{
    console.log('Method decorator!');
    console.log(target);
    console.log(name);
    console.log(propertyDescriptor);
    return {

    }
}

function Log4(target: any, name: string | Symbol, position: number){
    console.log('Parameter decorator!');
    console.log(target);
    console.log(name);
    console.log(position);
}
class Product {
    @Log
    title: string;
    private _price: number;

    @Log2
    set price(val: number){
        if(val > 0){
            this._price = val;
        } else {
            throw new Error('Invalid price - should be positive!');
        }
    }

    constructor(t: string, p: number){
        this.title = t;
        this._price = p;
    }
    @Log3
    getPriceWithTax(@Log4 tax: number){
        return this._price * (1 + tax);
    }
};


function Autobind(_1: any, _2: string, descriptor: PropertyDescriptor){
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        enumerable: false,
        get(){
            const boundFn = originalMethod.bind(this);
            return boundFn
        }
    }
    return adjDescriptor;
};
class Printer {
    message = 'This works'
    @Autobind
    showMessage(){
        console.log(this.message);
    }
}

const p = new Printer();
const button = document.querySelector('button')!

button.addEventListener('click', p.showMessage);

// ----

interface ValidatorConfig {
    [property: string]: {
        [validatableProp: string]: string[] // ['required', 'positive']
    }
}

const registeredValidators: ValidatorConfig = {};

function Required(target: any, propName: string) {
    registeredValidators[target.constructor.name] = {
        ...registeredValidators[target.constructor.name],
        [propName]: [...(registeredValidators[target.constructor.name]?.[propName] ?? []), 'required']
    };
}
 
function PositiveNumber(target: any, propName: string) {
    registeredValidators[target.constructor.name] = {
        ...registeredValidators[target.constructor.name],
        [propName]: [...(registeredValidators[target.constructor.name]?.[propName] ?? []), 'positive']
    };
}

function validateFn(obj: any){
    const objValidatorConfig = registeredValidators[obj.constructor.name];
    if(!objValidatorConfig){
        return true;
    }
    let isValid = true;
    for(const prop in objValidatorConfig){
        console.log(prop);
        for(const validator of objValidatorConfig[prop]){
            switch(validator){
                case 'required':
                    isValid = isValid && !!obj[prop];
                    break;
                case 'positive':
                    isValid = isValid && obj[prop] > 0;
                    break;
            }
        }
    }
    return isValid;
}
class Course {
    @Required
    title: string;
    @PositiveNumber
    price: number;
    constructor(t: string, p: number){
        this.title = t;
        this.price = p;
    }
};



const courseForm = document.querySelector('form')!;
courseForm.addEventListener('submit', event => {
    event.preventDefault();
    const titleEl = document.getElementById('title') as HTMLInputElement;
    const priceEl = document.getElementById('price') as HTMLInputElement;

    const title = titleEl.value;
    const price = +priceEl.value;

    const createdCourse = new Course(title, price);

    if(!validateFn(createdCourse)){
        alert('Invalid input, please tyr again!');
        return;
    };
    console.log(createdCourse);
})