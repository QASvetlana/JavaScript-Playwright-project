import { ChallengerService } from './challenger.service';
import { ChallengesService } from './challenges.service';
import { ToDosService } from './todos.service';
import { ToDoService } from './todo.service';

export class App {
    constructor(request) {
        this.request = request;
        this.challengerService = new ChallengerService(request);
        this.challengesService = new ChallengesService(request);
        this.todosService = new ToDosService(request);
        this.todoService = new ToDoService(request);
    }
}