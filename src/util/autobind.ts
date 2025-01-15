export function AutobindThis(_1: any, _2: string, descriptor: PropertyDescriptor){
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