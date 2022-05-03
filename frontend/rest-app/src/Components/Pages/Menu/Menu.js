import React from "react";
import Logo from "./MenuComponents/Logo";
import Mains from "./MenuComponents/Mains";
import Extras from "./MenuComponents/Extras";
import Total from "./MenuComponents/Total";
import { Provider } from "./MenuProvider/Context";
import {UserContext, UserProvider} from "../../../Api/Context/UserContext"
import { useEffect, useState, useContext } from "react";

import "./Menu.css";

export default function Menu() {
  
  const menu = {
    "mains": [
        {
          "name": "The Caesar",
          "description": "Crisp romaine lettuce tossed with our homemade Caesar dressing, croutons, and shredded parmesan cheese.",
          "price": "19"
        },
        {
          "name": "Surf & Turf",
          "description": "A grilled, queen-cut ribeye served with shrimp and scallop alfredo.",
          "price": "17"
        },
        {
          "name": "Creamy Sage",
          "description": "Chicken breast sautéed with fresh sage and prosciutto. Served atop creamy asiago linguini.",
          "price": "21"
        },
        {
          "name": "From the Sea",
          "description": "Fresh haddock, gulf shrimp, and sea scallops dipped in beer batter and fried to a golden brown.",
          "price": "23"
        },
        {
          "name": "BB's Tenderloin",
          "description": "Tenderloin tips, sautéed with bacon and mushrooms and finished with a bourbon-BBQ sauce.",
          "price": "18"
        },
        {
          "name": "Chicken Marsala",
          "description": "Boneless chicken breast sautéed with mushrooms and finished in a marsala and cream reduction.",
          "price": "22"
        }
      ],
      "sides": [
        {
          "name": "Fries",
          "price": "5"
        },
        {
          "name": "Onion Rings",
          "price": "4"
        },
        {
          "name": "Has Brown",
          "price": "3"
        },
        {
          "name": "Chicken Nuggets",
          "price": "4"
        },
        {
          "name": "Salad",
          "price": "6"
        },
        {
          "name": "Coleslaw",
          "price": "5"
        }
      ],
      "drinks": [
        {
          "name": "Soft Drink",
          "price": "4",
          "category": "drink"
        },
        {
          "name": "Orange Juice",
          "price": "5",
          "category": "drink"
        },
        {
          "name": "Iced Tea",
          "price": "4",
          "category": "drink"
        },
        {
          "name": "Coffee",
          "price": "6",
          "category": "drink"
        },
        {
          "name": "Smoothie",
          "price": "4",
          "category": "drink"
        },
        {
          "name": "Water",
          "price": "2",
          "category": "drink"
        }
      ]
  }
  const [token, setToken] = useContext(UserContext);
  const [dbmenu, setDbMenu] = useState([]);
  const [isLoadData, setLoadData] = useState(false);
  const fetchDishes = (token) => {
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:8000/api/dishes`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        })
        .then(res => res.json())
        .then(data => {
            resolve(data);
        })
        .catch(err => reject(err));
    });

}

  useEffect(() => {

      if(!isLoadData){
        fetchDishes(token)
        .then(data => {
          setDbMenu(data);
          setLoadData(true);
        })
        .catch(err => console.log(err));
      }

  })
  return (
    <UserProvider>
        <Provider>
                <div className="menu">
                    <Logo />
                    <Mains meals={dbmenu.filter(dishe => dishe.type == 1)} />
                    <aside className="aside">
                    <Extras type="Sides" items={dbmenu.filter(dishe => dishe.type == 2)} />
                    <Extras type="Drinks" items={dbmenu.filter(dishe => dishe.type == 3)} />
                    </aside>
                    <Total dishes={dbmenu} />
                </div>
        </Provider>
    </UserProvider>
  );
}