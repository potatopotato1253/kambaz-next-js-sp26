export default function AddingAndRemovingToFromArrays() {
  let numberArray1 = [1, 2, 3, 4, 5];
  let stringArray1 = ["string1", "string2"];

  let todoArray = [
    <li key="buy-milk">Buy milk</li>,
    <li key="feed-pets">Feed the pets</li>,
  ];

  numberArray1.push(6);
  stringArray1.push("string3");
  todoArray.push(<li key="walk-dogs">Walk the dogs</li>);

  return (
    <div id="wd-add-remove-to-from-arrays">
      <h4>Add/remove to/from arrays</h4>
      numberArray1 = {numberArray1} <br />
      stringArray1 = {stringArray1} <br />
      Todo list:
      <ol>{todoArray}</ol>
      <hr />
    </div>
  );
}
