import { computed, Injectable, signal } from '@angular/core';
import {
  Todo,
  TodoDraft,
  TodoEdit,
  TodoFilter,
  TodoPriority,
} from '../models/todo';

@Injectable({ providedIn: 'root' })
export class TodoStore {
  private readonly storageKey = 'todos-angular';
  private readonly todosState = signal<Todo[]>(this.loadTodos());
  private readonly filterState = signal<TodoFilter>('todas');

  readonly todos = this.todosState.asReadonly();
  readonly filter = this.filterState.asReadonly();

  readonly total = computed(() => this.todosState().length);
  readonly completed = computed(
    () => this.todosState().filter((todo) => todo.completed).length,
  );
  readonly pending = computed(() => this.total() - this.completed());

  readonly filteredTodos = computed(() => {
    const todos = this.todosState();
    const filter = this.filterState();

    if (filter === 'pendentes') {
      return todos.filter((todo) => !todo.completed);
    }

    if (filter === 'concluidas') {
      return todos.filter((todo) => todo.completed);
    }

    return todos;
  });

  setFilter(filter: TodoFilter): void {
    this.filterState.set(filter);
  }

  add(draft: TodoDraft): void {
    const normalizedTitle = draft.title.trim();

    if (!normalizedTitle || !draft.date) {
      return;
    }

    const newTodo: Todo = {
      id: Date.now(),
      title: normalizedTitle,
      completed: false,
      date: draft.date,
      priority: draft.priority,
    };

    this.updateTodos([...this.todosState(), newTodo]);
  }

  toggle(id: number): void {
    const updatedTodos = this.todosState().map((todo) =>
      todo.id === id
        ? { ...todo, completed: !todo.completed }
        : todo,
    );

    this.updateTodos(updatedTodos);
  }

  remove(id: number): void {
    const updatedTodos = this.todosState().filter((todo) => todo.id !== id);
    this.updateTodos(updatedTodos);
  }

  clearCompleted(): void {
    const pendingTodos = this.todosState().filter((todo) => !todo.completed);
    this.updateTodos(pendingTodos);
  }

  editTitle(edit: TodoEdit): void {
    const normalizedTitle = edit.title.trim();

    if (!normalizedTitle) {
      return;
    }

    const updatedTodos = this.todosState().map((todo) =>
      todo.id === edit.id
        ? { ...todo, title: normalizedTitle }
        : todo,
    );

    this.updateTodos(updatedTodos);
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
      const parsed = JSON.parse(savedTodos) as unknown;

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.map((item, index) => {
        const oldTodo = item as Partial<Todo>;

        return {
          id: typeof oldTodo.id === 'number' ? oldTodo.id : Date.now() + index,
          title: typeof oldTodo.title === 'string' ? oldTodo.title : 'Tarefa sem título',
          completed: Boolean(oldTodo.completed),
          date: typeof oldTodo.date === 'string' ? oldTodo.date : '',
          priority: this.isPriority(oldTodo.priority)
            ? oldTodo.priority
            : 'media',
        };
      });
    } catch {
      localStorage.removeItem(this.storageKey);
      return [];
    } 
  }

  private isPriority(value: unknown): value is TodoPriority {
    return value === 'baixa' || value === 'media' || value === 'alta';
  }
}