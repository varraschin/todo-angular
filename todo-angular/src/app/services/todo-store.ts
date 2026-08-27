import { computed, Injectable, signal } from '@angular/core';
import { Todo } from '../models/todo';

@Injectable({
  providedIn: 'root',
})
export class TodoStore {
  private readonly storageKey = 'todos-angular';
  private readonly todosState = signal<Todo[]>(this.loadTodos());

  readonly todos = this.todosState.asReadonly();
  readonly total = computed(() => this.todosState().length);
  readonly completed = computed(
    () => this.todosState().filter((todo) => todo.completed).length
  );
  readonly pending = computed(() => this.total() - this.completed());

  add(title: string): void {
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      return;
    }

    const newTodo: Todo = {
      id : Date.now(),
      title: normalizedTitle,
      completed: false
    }

    this.updateTodos([...this.todosState(), newTodo]);
  }

  toggle(id: number): void {
    const updateTodos = this.todosState().map((todo) =>
      todo.id === id 
        ? { ...todo, completed: !todo.completed }
        : todo
    );
    this.updateTodos(updateTodos);
  }

  remove(id: number): void {
    const updateTodos = this.todosState().filter((todo) =>
      todo.id !== id);
    this.updateTodos(updateTodos);
  }

  private updateTodos(todos: Todo[]): void {
    this.todosState.set(todos);
    localStorage.setItem(this.storageKey, JSON.stringify(todos));
  }

  private loadTodos(): Todo[] {
    const savedTodos = localStorage.getItem(this.storageKey);

    if (!savedTodos) {
      return [];
    }

    try {
      return JSON.parse(savedTodos) as Todo[];
    } catch {
      localStorage.removeItem(this.storageKey);
      return [];
    }
  }

}
