"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

export type Todo = {
  id: string;
  title: string;
};

type TodosContextState = {
  todos: Todo[];
  todo: Todo;
  setTodo: (todo: Todo) => void;
  addTodo: () => void;
  updateTodo: () => void;
  deleteTodo: (id: string) => void;
};

const TodosContext = createContext<TodosContextState | undefined>(undefined);

export function TodosProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([
    { id: "1", title: "Learn React" },
    { id: "2", title: "Learn Node" },
  ]);

  const [todo, setTodo] = useState<Todo>({ id: "-1", title: "Learn Mongo" });

  const addTodo = () => {
    const newTodo: Todo = { ...todo, id: Date.now().toString() };
    setTodos((prev) => [...prev, newTodo]);
    setTodo({ id: "-1", title: "" });
  };

  const updateTodo = () => {
    setTodos((prev) => prev.map((t) => (t.id === todo.id ? todo : t)));
    setTodo({ id: "-1", title: "" });
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    // optional: clear form if deleting the selected todo
    if (todo.id === id) setTodo({ id: "-1", title: "" });
  };

  const value = useMemo(
    () => ({ todos, todo, setTodo, addTodo, updateTodo, deleteTodo }),
    [todos, todo]
  );

  return <TodosContext.Provider value={value}>{children}</TodosContext.Provider>;
}

export function useTodos() {
  const ctx = useContext(TodosContext);
  if (!ctx) throw new Error("useTodos must be used within a TodosProvider");
  return ctx;
}