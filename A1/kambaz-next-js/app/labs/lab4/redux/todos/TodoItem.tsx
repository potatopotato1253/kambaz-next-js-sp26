"use client";

import { useDispatch } from "react-redux";
import { deleteTodo, setTodo } from "./todosReducer";
import { ListGroup, Button } from "react-bootstrap";

type Todo = { id: string; title: string };

export default function TodoItem({ todo }: { todo: Todo }) {
  const dispatch = useDispatch();

  return (
    <ListGroup.Item className="d-flex align-items-center justify-content-between">
      <span>{todo.title}</span>

      <span className="d-flex gap-2">
        <Button
          variant="primary"
          onClick={() => dispatch(setTodo(todo))}
          id="wd-set-todo-click"
        >
          Edit
        </Button>

        <Button
          variant="danger"
          onClick={() => dispatch(deleteTodo(todo.id))}
          id="wd-delete-todo-click"
        >
          Delete
        </Button>
      </span>
    </ListGroup.Item>
  );
}