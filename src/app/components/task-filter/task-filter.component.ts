import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskFilter } from '../../models/tasks';

@Component({
  selector: 'app-task-filter',
  templateUrl: './task-filter.component.html',
 
})
export class TaskFilterComponent {
  @Input() currentFilter: TaskFilter = 'all';
  @Output() filterChange = new EventEmitter<TaskFilter>();

  filters: { value: TaskFilter, label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' }
  ];

  onFilterChange(filter: TaskFilter): void {
    this.currentFilter = filter;
    this.filterChange.emit(filter);
  }
}