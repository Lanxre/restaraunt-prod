import './Order.css';
import { useState, useContext, useEffect } from 'react';
import { fetchUser } from '../../../Api/http/userRequests';
import { toast } from 'wc-toast'
import { useNavigate } from 'react-router-dom';
import {UserContext, UserProvider} from "../../../Api/Context/UserContext";

export default function Order(){

    const [token, setToken] = useContext(UserContext);
    const [user, setUser] = useState({});
    const [isLoadUser, setLoadUser] = useState(false);
    const [orderTables, setOrderTables] = useState(JSON.parse(sessionStorage.getItem('orderTables')));
    const [orderDishes, setOrderDishes] = useState(JSON.parse(sessionStorage.getItem('sendDish')))
    const navigate = useNavigate();

    useEffect(async () => {
        if(!isLoadUser){
            await fetchUser(token).then(data => {
                setUser(data)
                setLoadUser(true)
            })
        }
    })


    const today = () => {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let yyyy = today.getFullYear();

        today = dd + '-' + mm + '-' + yyyy;
        return today;
        
    }

    return (
        <UserProvider>
        <div className="order">
            <wc-toast></wc-toast>
            <div className="order-component">
                <span className="order-logo">Ваш заказ</span>
            </div>

            <div className="order-component-list">
                {orderTables ? orderTables.map(elem => {
                    return (
                        <div className="order-item" key={elem.table_id}>
                           <div>
                                Стол № {elem.table_id}, {elem.table_price === 5 ? 'некурящий' : 'курящий'}
                           </div>
                           <div>
                                Стоимость: {elem.table_price} $
                           </div>
                        </div>
                        
                    )
                }) : null}
            </div>
            { orderTables ? <div className="order-component-list">
                <div className="order-total">
                    <span className="total-title">Всего:</span>
                    <span className="total-price">${orderTables.reduce( (last, current) =>
                        last + Number(current['table_price']) * (current['quantity'] ? current['quantity'] : 1), 0)}
                    </span>
                </div>
                <div>
                    <button className="order-make-order" style={{background: 'black'}}
                    
                    onClick={
                        async () => {
                            if(orderTables.length > 0){
                                toast.success('Ваш заказ принят', {
                                    duration: 4000
                                })
                                setOrderTables([])
                                await fetch('http://localhost:8000/api/orders', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${token}`
                                    },
                                    body: JSON.stringify({
                                        price: Number(orderTables.reduce( (last, current) =>
                                        last + Number(current['table_price']) * (current['quantity'] ? current['quantity'] : 1), 0)),
                                        date: today(),
                                        status: 'Ожидание подтверждения',
                                    })
                                }).then(res => res.json())
                                .then(async data => {
                                    await fetch('http://localhost:8000/api/order/table-detail', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${token}`
                                        },
                                        body: JSON.stringify(
                                            {
                                                data:orderTables.map(elem => {
                                                    return {
                                                        order_id: data.id,
                                                        table_id: elem.table_id,
                                                        user_id : user.user_id
                                                    }
                                                })
                                            }

                                        )
                                    })
                                    sessionStorage.removeItem('orderTables')
                                    navigate('/profile/my-order')
                                })
                            }
                        }
                    }
                    
                    >Заказать</button>
                </div>
            </div> 
            : null}

            {/* MENU ORDER */}

            { orderDishes ? <div className="order-component-list">
                
        <div className="background">
            <div className="check">
                <h1 id='order-menu-title'>LanoreCheck™</h1>
                <div className="meta">
                <div className="meta-item">
                    <h2 className="meta-item-label" h2>Дата</h2>
                    <h2 className="meta-item-label" h2>{today()}</h2>
                </div>
                <div className="meta-item">
                    <h2 className="meta-item-label"></h2>
                </div>
                <div className="meta-item">
                    <h2 className="meta-item-label">Количество блюд</h2>
                    <h2 className="meta-item-label" style={{fontSize:'15px'}}>{orderDishes.length}</h2>
                </div>
                <div className="meta-item">
                    <h2 className="meta-item-label"></h2>
                </div>
                <div className="meta-item">
                    <h2 className="meta-item-label">Пользователь</h2>
                    <h2 className="meta-item-label">{user.user_login}</h2>
                </div>
                </div>
                <h3 className="item-types">
                Перечень заказанных блюд
                </h3>
                <div className="order-list-container">
                <div className="order-list writing">
                    <h3 className="total-menu-order">Всего</h3>
                    <h3 className="thank-you">Спасибо за заказ</h3>

                    {orderDishes.map((elem, index) => {
                        return (
                            <h3 className="ordered-item"
                            style={{
                                gridRow: `${index + 1} / ${index + 2}`,
                                gridColumn: '2 / 4'
                            }}>{elem.name}</h3>
                        )
                    })}
                    {orderDishes.map((elem, index) => {
                        return (
                            <h3 className="ordered-item"
                            style={{
                                gridRow: `${index + 1} / ${index + 2}`,
                                gridColumn: '4 / 4',
                                transform: 'scale(1.2) skewy(-7deg) skewx(-5deg)'
                            }}>{elem.price * elem.quantity} $</h3>
                        )
                    })}
                    {orderDishes.map((elem, index) => {
                        return (
                            <h3 className="ordered-item"
                            style={{
                                gridRow: `${index + 1} / ${index + 2}`,
                                gridColumn: '3 / 4'
                            }}>{elem.quantity}</h3>
                        )
                    })}
                    <h3 className="ordered-item" style={{
                        gridColumn: '4 / 4',
                        gridRow: '17 / 18',
                    }}>{orderDishes.reduce( (last, current) =>
                        last + Number(current['price']) * (current['quantity'] ? current['quantity'] : 1), 0)} $</h3>
                </div>

                <div className="order-list grid-lines">
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                    <div className="grid-item"></div>
                </div>

                </div>
                <div className="company-info">
                <h4 className="small-caps">Lanore™</h4>
                <h4>lanore.com</h4>
                <h4 className="small-caps belarus">made in the Belarus</h4>
                </div>
                <div className="perforation"></div>
                
            </div>
            </div>
            <div>
                    <button className="order-make-order" style={{background: 'black'}}
                    
                    onClick={
                        async () => {
                            if(orderDishes.length > 0){
                                toast.success('Ваш заказ принят', {
                                    duration: 4000
                                })
                                setOrderTables([])
                                await fetch('http://localhost:8000/api/orders', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${token}`
                                    },
                                    body: JSON.stringify({
                                        price: Number(orderDishes.reduce( (last, current) =>
                                        last + Number(current['price']) * (current['quantity'] ? current['quantity'] : 1), 0)),
                                        date: today(),
                                        status: 'Ожидание подтверждения',
                                    })
                                }).then(res => res.json())
                                .then(async data =>  {
                                    await fetch('http://localhost:8000/api/order/menu-detail', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${token}`
                                        },
                                        body: JSON.stringify(
                                            {
                                                data:orderDishes.map(elem => {
                                                    return {
                                                        order_id: data.id,
                                                        user_id : user.user_id,
                                                        dish_id : elem.dish_id,
                                                        dish_type: elem.type,
                                                        total_price: elem.price,
                                                        quantity: elem.quantity,
                                                    }
                                                })
                                            }

                                        )
                                    })
                                    sessionStorage.removeItem('sendDish')
                                    navigate('/profile/my-order')
                                })
                            }
                        }
                    }
                    
                    >Заказать</button>
                </div>
                </div> : null}

        </div>
        </UserProvider>
    )
}