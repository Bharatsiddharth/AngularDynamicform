import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, interval, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Task } from '../models/tasks';

@Injectable({
  providedIn: 'root'
})
export class TaskUpdateService implements OnDestroy {
  private taskUpdateSubject = new Subject<Task>();
  taskUpdates$: Observable<Task> = this.taskUpdateSubject.asObservable();
  
  private updateInterval: Subscription | null = null;
  private destroy$ = new Subject<void>();
  private lastId = 200; // Start with high ID to avoid conflicts with API data

  constructor() { }

  startSimulation(): void {
    // If already running, don't start again
    if (this.updateInterval) {
      return;
    }

    // Simulate WebSocket connection with interval
    this.updateInterval = interval(5000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        // Randomly decide whether to add a new task or update an existing one
        const isNewTask = Math.random() > 0.5;
        
        if (isNewTask) {
          this.simulateNewTask();
        } else {
          this.simulateTaskUpdate();
        }
      });
      
    console.log('Real-time task update simulation started');
  }

  stopSimulation(): void {
    if (this.updateInterval) {
      this.updateInterval.unsubscribe();
      this.updateInterval = null;
      console.log('Real-time task update simulation stopped');
    }
  }

  ngOnDestroy(): void {
    this.stopSimulation();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private simulateNewTask(): void {
    this.lastId++;
    const newTask: Task = {
      id: this.lastId,
      title: `New task ${this.lastId} - ${new Date().toLocaleTimeString()}`,
      completed: Math.random() > 0.5
    };
    
    this.taskUpdateSubject.next(newTask);
    console.log('New task added:', newTask);
  }

  private simulateTaskUpdate(): void {
    // Simulate updating a random task between ID 1-20
    // In a real app, this would be an actual task ID from your data
    const taskId = Math.floor(Math.random() * 20) + 1;
    
    const updatedTask: Task = {
      id: taskId,
      title: `Updated task ${taskId} - ${new Date().toLocaleTimeString()}`,
      completed: Math.random() > 0.5
    };
    
    this.taskUpdateSubject.next(updatedTask);
    console.log('Task updated:', updatedTask);
  }
}