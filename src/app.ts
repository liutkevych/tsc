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