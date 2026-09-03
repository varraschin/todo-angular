export type TodoPriority = 'baixa' | 'media' | 'alta';
export type TodoFilter = 'todas' | 'pendentes' | 'concluidas';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  date: string;
  priority: TodoPriority;
}

export interface TodoDraft {
  title: string;
  date: string;
  priority: TodoPriority;
}

export interface TodoEdit {
  id: number;
  title: string;
}