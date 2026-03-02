"use client";

import { create } from "zustand";

export type Todo = {
  id: string;
  title: string;
};

type TodoStore = {
  todos: Todo[];
  todo: Todo;
  setTodo: (todo: Todo) => void;
  addTodo: () => void;
  updateTodo: () => void;
  deleteTodo: (id: string) => void;
};

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [
    { id: "1", title: "Learn React" },
    { id: "2", title: "Learn Node" },
  ],
  todo: { id: "-1", title: "Learn Mongo" },

  setTodo: (todo) => set({ todo }),

  addTodo: () => {
    const { todos, todo } = get();
    const newTodo: Todo = { ...todo, id: Date.now().toString() };
    set({
      todos: [...todos, newTodo],
      todo: { id: "-1", title: "" },
    });
  },

  updateTodo: () => {
    const { todos, todo } = get();
    set({
      todos: todos.map((t) => (t.id === todo.id ? todo : t)),
      todo: { id: "-1", title: "" },
    });
  },

  deleteTodo: (id) => {
    const { todos, todo } = get();
    const newTodos = todos.filter((t) => t.id !== id);
    const newFormTodo = todo.id === id ? { id: "-1", title: "" } : todo;
    set({ todos: newTodos, todo: newFormTodo });
  },
}));