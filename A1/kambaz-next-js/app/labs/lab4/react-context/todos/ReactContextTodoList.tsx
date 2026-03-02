"use client";

import { ListGroup, Button, FormControl } from "react-bootstrap";
import { useTodos } from "./todosContext";

export default function ReactContextTodoList() {
  const { todos, todo, setTodo, addTodo, updateTodo, deleteTodo } = useTodos();

  return (
    <div id="wd-react-context-todo-list">
      <h2>Todo List</h2>

      <ListGroup className="mb-3">
        {/* Form row */}
        <ListGroup.Item className="d-flex align-items-center gap-2">
          <FormControl
            value={todo.title || ""}
            onChange={(e) => setTodo({ ...todo, title: e.target.value })}
            className="me-auto"
          />

          <Button
            variant="warning"
            onClick={updateTodo}
            id="wd-react-context-update-todo-click"
          >
            Update
          </Button>

          <Button
            variant="success"
            onClick={addTodo}
            id="wd-react-context-add-todo-click"
          >
            Add
          </Button>
        </ListGroup.Item>

        {/* Todo rows */}
        {todos.map((t) => (
          <ListGroup.Item
            key={t.id}
            className="d-flex align-items-center justify-content-between"
          >
            <span>{t.title}</span>

            <span className="d-flex gap-2">
              <Button
                variant="primary"
                onClick={() => setTodo(t)}
                id="wd-react-context-set-todo-click"
              >
                Edit
              </Button>

              <Button
                variant="danger"
                onClick={() => deleteTodo(t.id)}
                id="wd-react-context-delete-todo-click"
              >
                Delete
              </Button>
            </span>
          </ListGroup.Item>
        ))}
      </ListGroup>

      <hr />
    </div>
  );
}