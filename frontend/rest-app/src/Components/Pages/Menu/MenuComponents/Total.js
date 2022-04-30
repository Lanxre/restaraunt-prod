import React, { useContext } from "react";
import { Context } from "../MenuProvider/Context";
import { useState } from "react";


export default function Total({dishes}) {
  const [items] = useContext(Context);

  function getType(group){
    switch (group) {
      case "mains":
        return 1
      case "sides":
        return 2
      case "drinks":
        return 3
    }
  }

  const totalPrice = Object.keys(items).reduce((acc, curr) => {
    const [group, item] = curr.split("-");
    
    const dish = dishes.filter(dish => dish.type == getType(group))[item];
    const amount = items[curr] * dish.price;
    return acc + amount;
  }, 0);


  return (
    <div className="total">
      <span className="total-clear" onClick={
        () => {
          //clear all items
          Object.keys(items).forEach(key => {
            delete items[key];
          }
        )
        let dis = document.querySelectorAll("input");
          dis.forEach(dish => {
            dish.value = "";
          })
        }
      }>Очистить выбранное</span>
      <span className="total-title">Всего:</span>
      <span className="total-price">${totalPrice}</span>
    </div>
  );
}
