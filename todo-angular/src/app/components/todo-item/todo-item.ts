import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Todo, TodoEdit, TodoPriority } from '../../models/todo';

@Component({
  selector: 'app-todo-item',
  imports: [FormsModule],
  templateUrl: './todo-item.html',
  styleUrl: './todo-item.css',
})
export class TodoItem {
  readonly todo = input.required<Todo>();
  readonly todoToggled = output<number>();
  readonly todoRemoved = output<number>();
  readonly todoEdited = output<TodoEdit>();

  readonly editing = signal(false);
  editTitle = '';

  startEdit(): void {
    this.editTitle = this.todo().title;
    this.editing.set(true);
  }

  cancelEdit(): void {
    this.editing.set(false);
    this.editTitle = '';
  }

  saveEdit(): void {
    const normalizedTitle = this.editTitle.trim();

    if (!normalizedTitle) {
      return;
    }

    this.todoEdited.emit({
      id: this.todo().id,
      title: normalizedTitle,
    });

    this.editing.set(false);
    this.editTitle = '';
  }

  formatDate(date: string): string {
    if (!date) {
      return 'Sem data';
    }

    const [year, month, day] = date.split('-');

    if (!year || !month || !day) {
      return date;
    }

    return `${day}/${month}/${year}`;
  }

  priorityLabel(priority: TodoPriority): string {
    const labels: Record<TodoPriority, string> = {
      baixa: 'Baixa',
      media: 'Média',
      alta: 'Alta',
    };

    return labels[priority];
  }
}