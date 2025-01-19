import { ProjectInput } from "./components/project-input-coponent";
import { ProjectList } from "./components/project-list-component";
import _ from 'lodash';

new ProjectInput();
new ProjectList('active');
new ProjectList('finished');

console.log(_.shuffle([1, 2, 3]));