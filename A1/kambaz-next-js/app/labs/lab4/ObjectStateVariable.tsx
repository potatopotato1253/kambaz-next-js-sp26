"use client";
import { useState } from "react";
import { FormControl } from "react-bootstrap";

export default function ObjectStateVariable() {
  const [person, setPerson] = useState<{ name: string; age: number | "" }>({
    name: "Peter",
    age: 24,
  });

  return (
    <div>
      <h2>Object state variables</h2>
      <pre>{JSON.stringify(person, null, 2)}</pre>
      <FormControl
        value={person.name}
        onChange={(e) => setPerson({ ...person, name: e.target.value })}
      />
      <FormControl
        type="number"
        value={person.age}
        onChange={(e) => {
          const v = e.target.value;          
          setPerson({ ...person, age: v === "" ? "" : Number(v) });
        }}
      />
      <hr />
    </div>
  );
}