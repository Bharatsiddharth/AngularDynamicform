import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Task, TaskFilter } from '../models/tasks';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/todos';
  
  constructor(private http: HttpClient) { }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl)
      .pipe(
        catchError(error => {
          console.error('Error fetching tasks', error);
          return of(this.getMockTasks()); // Fallback to mock data if API fails
        })
      );
  }

  // Filter tasks based on the selected filter
  filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
    switch (filter) {
      case 'pending':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'all':
      default:
        return tasks;
    }
  }

  // Get paginated tasks
  getPaginatedTasks(tasks: Task[], page: number, pageSize: number): Task[] {
    const startIndex = (page - 1) * pageSize;
    return tasks.slice(startIndex, startIndex + pageSize);
  }

  // Mock data in case the API fails
  private getMockTasks(): Task[] {
    return [
      { id: 1, title: 'Complete Angular assignment', completed: false },
      { id: 2, title: 'Learn RxJS', completed: true },
      { id: 3, title: 'Implement dynamic forms', completed: false },
      { id: 4, title: 'Create task list component', completed: true },
      { id: 5, title: 'Add pagination', completed: false },
      { id: 6, title: 'Implement real-time updates', completed: false },
      { id: 7, title: 'Write unit tests', completed: false },
      { id: 8, title: 'Submit project', completed: false },
      { id: 9, title: 'Review feedback', completed: false },
      { id: 10, title: 'Make improvements', completed: false }
    ];
  }
}