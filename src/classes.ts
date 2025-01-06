// Code goes here!
abstract class Department {
    // private name: string;
    // private readonly id: string;
    // protected modifire make the property unavailable from the outside
    // but available from inside and from enhereted classes
    protected employees: string[] = [];

    // static properties and methods could be available only inside 
    // another static props or methods of the class
    // we can not access static methods or props in object created based on this class
    static fiscalYear = 2025;

    constructor(private readonly id: string, public name: string){
        // this.id = id;
        // this.name = name;
    }

    describe() {
        console.log('Department: ' + this.name, this.id);
    }
    // abstract method will force to create it's own implementation
    // for every class inherited from this one
    abstract clreateLogo(url: string): void;

    addEmployee(employee: string){
        this.employees.push(employee);
    }

    pringEmployeeInfromation(){
        // console.log(this.fiscalYear) there we have no access to the static prop
        console.log(this.employees.length);
        console.log(this.employees);
    }
    static createEmployee (name: string){
        console.log(this.fiscalYear) // here we have access to the static prop
        return {
            name: name
        }
    }
}

class ITDepartment extends Department {
    admins: string[];
    constructor(id: string, admins: string[]) {
        super(id, 'IT');
        this.admins = admins;
    }

    clreateLogo(url: string): void {
        console.log(encodeURIComponent(url));
    }
}

class AccountingDepartment extends Department {
    private lastReport: string;
    private static instance: AccountingDepartment;
    get mostRecentReport(){
        if(this.lastReport){
            return this.lastReport;
        }
        throw new Error('No report found.');
    }

    set mostRecentReport(value: string){
        if(!value){
            throw new Error('Please be sure that you add a valid report')
        }
        this.addReport(value);
    }
    // the way of creation a Singltone;
    private constructor(id: string, private reports: string[]){
        super(id, 'Accounting');
        this.lastReport = reports[0];
    }

    static getInstance(){
        if (this.instance){
            return this.instance;
        } 
        this.instance = new AccountingDepartment('d2', [])
        return this.instance;
    }

    clreateLogo(url: string): void {
        console.log(decodeURIComponent(url));
    }

    addReport(text: string){
        this.reports.push(text);
        this.lastReport = text;
    }

    printReports(){
        console.log(this.reports);
    }

    addEmployee(employee: string) {
        if(employee === 'Max'){
            return;
        }
        this.employees.push(employee);
    }
}

const it_depart = new ITDepartment('d2', ['Alex']);
// const accounting = new AccountingDepartment('d1', []);
const accounting = AccountingDepartment.getInstance();
const accounting2 = AccountingDepartment.getInstance();

console.log(accounting);
console.log(accounting2);

const employee1 = Department.createEmployee('Olko');

accounting.addEmployee('Alex');
accounting.addEmployee('Dude');
accounting.pringEmployeeInfromation();
accounting.addReport('Some dummy report');
accounting.mostRecentReport = 'hedge bola bola';
console.log(accounting.mostRecentReport);
accounting.printReports();

