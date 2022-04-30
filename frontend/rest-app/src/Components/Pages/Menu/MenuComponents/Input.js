import React, { useContext } from "react";
import { Context } from "../MenuProvider/Context";

export default function Input({ type, name, index }) {
  const [items, updateItem] = useContext(Context);

  return (
    <div className="menuinput">
      <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      onChange={({ target }) => updateItem(type, index, target.value)}
      name={name.replace(" ", "-").toLowerCase()}
    />
    </div>
  );
}
