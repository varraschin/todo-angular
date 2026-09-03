import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodoDraft, TodoPriority } from '../../models/todo';

@Component({
  selector: 'app-todo-form',
  imports: [FormsModule],
  templateUrl: './todo-form.html',
  styleUrl: './todo-form.css',
})
export class TodoForm {
  readonly todoAdded = output<TodoDraft>();

  title = '';
  date = '';
  priority: TodoPriority = 'media';

  submit(): void {
    const normalizedTitle = this.title.trim();

    if (!normalizedTitle || !this.date) {
      return;
    }

    this.todoAdded.emit({
      title: normalizedTitle,
      date: this.date,
      priority: this.priority,
    });

    this.title = '';
    this.date = '';
    this.priority = 'media';
  }
}