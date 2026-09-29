import type { Todo, TodoInput } from "../types";
import { TodoItem } from "./TodoItem";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => Promise<void>;
  onSave: (id: number, input: TodoInput) => Promise<boolean>;
  onDelete: (id: number) => Promise<void>;
}

export function TodoList({ todos, onToggle, onSave, onDelete }: TodoListProps) {
  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onSave={onSave}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
