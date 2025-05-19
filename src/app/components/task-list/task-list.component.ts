import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Task, TaskFilter } from '../../models/tasks';
import { TaskService } from '../../services/task.service';
import { TaskUpdateService } from '../../services/task-update.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  
})
export class TaskListComponent implements OnInit, OnDestroy {
  allTasks: Task[] = [];
  filteredTasks: Task[] = [];
  displayedTasks: Task[] = [];
  
  currentFilter: TaskFilter = 'all';
  currentPage: number = 1;
  pageSize: number = 5;
  
  loading: boolean = true;
  error: string | null = null;
  
  private destroy$ = new Subject<void>();

  constructor(
    private taskService: TaskService,
    private taskUpdateService: TaskUpdateService
  ) { }

  ngOnInit(): void {
    this.loadTasks();
    this.subscribeToTaskUpdates();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTasks(): void {
    this.loading = true;
    this.taskService.getTasks()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tasks) => {
          this.allTasks = tasks;
          this.applyFilterAndPagination();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load tasks. Please try again later.';
          this.loading = false;
          console.error('Error loading tasks:', err);
        }
      });
  }

  subscribeToTaskUpdates(): void {
    this.taskUpdateService.taskUpdates$
      .pipe(takeUntil(this.destroy$))
      .subscribe(updatedTask => {
        // Check if the task already exists
        const existingTaskIndex = this.allTasks.findIndex(task => task.id === updatedTask.id);
        
        if (existingTaskIndex !== -1) {
          // Update existing task
          this.allTasks[existingTaskIndex] = updatedTask;
        } else {
          // Add new task
          this.allTasks.unshift(updatedTask);
        }
        
        this.applyFilterAndPagination();
      });
  }

  onFilterChange(filter: TaskFilter): void {
    this.currentFilter = filter;
    this.currentPage = 1; // Reset to first page when filter changes
    this.applyFilterAndPagination();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.applyFilterAndPagination();
  }

  toggleTaskStatus(task: Task): void {
    task.completed = !task.completed;
    this.applyFilterAndPagination();
  }

  private applyFilterAndPagination(): void {
    // Apply filter
    this.filteredTasks = this.taskService.filterTasks(this.allTasks, this.currentFilter);
    
    // Apply pagination
    this.displayedTasks = this.taskService.getPaginatedTasks(
      this.filteredTasks, 
      this.currentPage, 
      this.pageSize
    );
  }
}