import { ProjectStatus, State } from "../interfaces/interfaces";
import { Project } from "../modules/project";

export class ProjectState extends State<Project>{
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
        this.updateListeners();
    };
    
    moveProject(projectId: string, newStatus: ProjectStatus){
        const project = this.projects.find(prj => prj.id === projectId);
        if(project && project.status !== newStatus){
            project.status = newStatus;
            this.updateListeners();
        }
    }
    
    private updateListeners(){
        for (const listenerFn of this.listeners){
            listenerFn(this.projects.slice()) // pass copy of projects but not themselves
        }
    }
}

export const projectState = ProjectState.getInstance();