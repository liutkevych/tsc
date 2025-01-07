const names: Array<string> = []; // string[]

// const promise: Promise<number> = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve(10);
//     }, 2000)
//     reject();
// });

function merge<T extends object, U extends object>(objA: T, objB: U){
    return Object.assign({}, objA, objB)
}

const mergedObj = merge({name: 'Alex', hobbies: ['Sports']}, {age:42})
console.log(mergedObj);

interface Lengthy {
    length: number;
}

function countAndDescribe<T extends Lengthy>(element: T): [T, string] {
    let descriptionText = 'Got no value.';
    if (element.length === 1){
        descriptionText = 'Got 1 element.'
    } else if (element.length > 1) {
        descriptionText = 'Got ' + element.length + ' elements.'
    }
    return [element, descriptionText];
}

console.log(countAndDescribe('Hi there!'));
console.log(countAndDescribe(['sports', 'cooking']))

function extractAndConvert<T extends object, U extends keyof T>(obj: T,key: U){
    return 'Value: ' + obj[key];
}

extractAndConvert({name: 'Alex'}, 'name');

// generic classes
class DataStorage<T extends string | number | boolean> {
    private data: T[] = [];

    addItem(item: T){
        this.data.push(item);
    }
    removeItem(item: T){
        this.data.splice(this.data.indexOf(item), 1);
    }

    getItems(){
        return [...this.data];
    }
}

const textStorage = new DataStorage<string>();
textStorage.addItem('Alex');
textStorage.addItem('Jhohn');
console.log(textStorage.getItems());
textStorage.removeItem('Alex');
console.log(textStorage.getItems());


// Partial
interface CourseGoal {
    title: string;
    description: string;
    copleteIntil: Date;
}

function CreateCourseGoal(title: string, description: string, date: Date): CourseGoal {
    let courseGoal: Partial<CourseGoal> = {};
    courseGoal.title = title;
    courseGoal.description = description;
    courseGoal.copleteIntil = date;
    return courseGoal as CourseGoal;
}

// ReadOnly
const commonNames: Readonly<string[]> = ['Max', 'Anna'];
// commonNames.push('Manue'); // it will throw an error
// commonNames.pop(); // it will throw an error
console.log(commonNames);
