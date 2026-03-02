"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { ListGroup, Button } from "react-bootstrap";

export default function ArrayStateVariable() {
  const { todos } = useSelector(
    (state: RootState) => state.todosReducer
  );

  const [array, setArray] = useState([1, 2, 3, 4, 5]);

  const addElement = () => {
    setArray([...array, Math.floor(Math.random() * 100)]);
  };

  const deleteElement = (index: number) => {
    setArray(array.filter((_, i) => i !== index));
  };

  return (
    <div id="wd-array-state-variables">
      <h2>Array State Variable</h2>

      <Button variant="success" className="mb-2" onClick={addElement}>
        Add Element
      </Button>

      <ListGroup className="mb-3">
        {array.map((item, index) => (
          <ListGroup.Item
            key={index}
            className="d-flex justify-content-between align-items-center"
          >
            {item}
            <Button
              variant="danger"
              size="sm"
              onClick={() => deleteElement(index)}
            >
              Delete
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Redux Todos Section */}
      <ListGroup className="mb-3">
        {todos.map((todo: any) => (
          <ListGroup.Item key={todo.id}>
            {todo.title}
          </ListGroup.Item>
        ))}
      </ListGroup>

      <hr />
    </div>
  );
}