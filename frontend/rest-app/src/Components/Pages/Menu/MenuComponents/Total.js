import { Context } from "../MenuProvider/Context";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../../Api/Context/UserContext";

export default function Total({dishes}) {
  const [items] = useContext(Context);
  const [token, setToken] = useContext(UserContext);
  const [sendDish, setSendDishes] = useState([])
  const navigate = useNavigate();

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
      {token ?
      
      <span style={{cursor: 'pointer'}} onClick={
        async () => {
           Object.keys(items).map(async key => {
              if(items[key] === 0){
                delete items[key];
              }
              
              const dish_id = key.split("-")[1];
              let type_id = key.split("-")[0] == 'mains' ? 1 : 'sides' ? 2 : 'drinks' ? 3 : null;
              if(key.split("-")[0] == 'drinks'){
                type_id = 3
              }
              await fetch(`http://localhost:8000/api/dishes-type/?dish_id=${dish_id}&type_id=${type_id}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
              }).then(res => res.json())
              .then(data => {
                setSendDishes(sendDish => {
                  data.quantity = items[key];
                  data.dish_id = dish_id;
                  sessionStorage.setItem('sendDish', JSON.stringify([...sendDish, data]))
                  return [...sendDish, data]
                })
                setTimeout(() => {navigate('/order')}, 100)
              })
              
          })
           
        }
      }>Заказать</span>
      
      : null}
    </div>
  );
}
