type Admin = {
    name: string;
    privileges: string[];
};

type GeneralEmployee = {
    name: string;
    startDate: Date;
};

type ElevatedEmployee = Admin & GeneralEmployee;
// For object types intersaction will work in the same manner
// as 'extends' for interfaces. For example:
// interface ElevatedEmployee extends Admin, GeneralEmployee {}

const e1: ElevatedEmployee = {
    name: 'Alex',
    privileges: ['create-server'],
    startDate: new Date()
}

// For non-object types intersaction will work in a way that only type wich is the same
// for all participants will be defined as intersected
type Combinable = string | number;
type Numeric = number | boolean;

type Universal = Combinable & Numeric;

let intersected: Universal;
// intersected = 'Alex';

function typeGuardedAdd(a: Combinable, b: Combinable) {
    // type guard implementation
    if (typeof a === 'string' || typeof b === 'string'){
        return a.toString() + b.toString();
    }
    return a + b;
}

type UnknownEmployee = GeneralEmployee | Admin;

function printEmployeeInformation(emp: UnknownEmployee) {
    console.log('Name: ' + emp.name);
    // type guard implementation for object types
    if('privilages' in emp){
        console.log('Privilages: ' + emp.privilages)
    }
    if('startDate' in emp){
        console.log('Start date is: ' + emp.startDate)
    }
}

printEmployeeInformation(e1);

class Car {
    drive(){
        console.log('Driving ...')
    }
}

class Truck {
    drive(){
        console.log('Driving a truck ...');
    }
    loadCargo(amount: number){
        console.log('Loading cargo ...' + amount)
    }
}

type Vehicle = Car | Truck;

const v1 = new Car();
const v2 = new Truck();

function useVehicle(vehicle: Vehicle){
    vehicle.drive()
    // type guard implementation for classes
    if (vehicle instanceof Truck){
        vehicle.loadCargo(100);
    }
}

useVehicle(v1);
useVehicle(v2);

// Discriminated Union

/**
 * For discriminating union you have to have one commont property
 * for all participants, in next example it's a 'type' property
 */

interface Bird {
    type: 'bird';
    flyingSpeed: number;
}

interface Horse {
    type: 'horse';
    runningSpeed: number
}

type Animal = Bird | Horse;

function moveAnimal(animal: Animal){
    let speed;
    switch(animal.type){
        case'bird':
            speed = animal.flyingSpeed;
            break;
        case 'horse':
            speed = animal.runningSpeed;
            break;
    }
    console.log('Mooving at speed: ' + speed);
}

moveAnimal({type: 'horse', runningSpeed: 20})

/**
 * TYPE CASTING!!!
 * there are two ways of type casting
 * for tsx (React) only second one is appropriate
 */
// const userInputElement = <HTMLInputElement>document.getElementById('user-input');
// const userInputElement = document.getElementById('user-input') as HTMLInputElement;

// userInputElement.value = 'Hi there!'


// Index properties
interface ErrorContainer {
    [prop: string]: string;
}

const errorBag: ErrorContainer = {
    email: 'Not a valid email!',
    username: 'Must start with a capital letter!'
};

// Optional chaining
const fetchedUserData = {
    id: 'u1',
    name: 'Alex',
    job: {title: 'CEO', description: 'My own company'}
}

console.log(fetchedUserData.job?.title);

// Nullish Coalescing
const userInput = '';
const storedData = userInput || 'DEFAULT' // will return 'DEFAULT';
// const userInput = '';
// const storedData = userInput ?? 'DEFAULT' // will return ''
// in this example it will always return userInput unless it is 'null' or 'undefined'
