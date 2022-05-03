import './Managment.css';
import { useState, useEffect, useContext } from 'react';
import { notConfirmTableOrder, notConfirmDishOrder } from './ordersAllDb';
import { useNavigate } from 'react-router-dom';
import {fetchUser} from '../../../Api/http/userRequests';
import {UserContext, UserProvider} from "../../../Api/Context/UserContext";
import Stats from "../../../Assets/statistics.png";
import  PoccesingCard  from './proccesingCard';


export default function Managment() {

    const [token, setToken] = useContext(UserContext);
    const [user, setUser] = useState({})
    const [orderNotConfirm, setNotConfirm] = useState([])
    const [orderDishNotConfirm, setOrderDishNotConfirm] = useState([])

    const [isLoading, setLoading] = useState(false)

    const [stats, setStats] = useState(null)
    const [jsxOrders, setJsxOrders] = useState(null)
    const navigate = useNavigate();

    useEffect(async () => {
        if(token && !isLoading) {
            await fetchUser(token).then(data => {
                setUser(data)
            })
            await notConfirmTableOrder(token).then(data => {
                if(data.detail !==  'Order detail not found'){
                    setNotConfirm(data)
                }
            })
            await notConfirmDishOrder(token).then(data => {
                if(data.detail !==  'Order detail not found'){
                    setOrderDishNotConfirm(data)
                }
            })
            setLoading(true)
        }
        if(!token) {
            navigate('/')
        }

    }, [token, isLoading])
    return (
        <UserProvider>
            <div className="Managment">
            <div className="manag-nav">
                    <div className="dropdown">
                    <div className="dropbtn"> Заказы</div>
                    <div className="dropdown-content">
                        <a href="#">Все заказы</a>
                        <a onClick={() =>{
                            setJsxOrders(true)
                            setStats(false)
                        }}>На рассмотрение</a>
                    </div>
                    </div>

                
                
                <div className="dropdown">
                    <div className="dropbtn"> Статистика</div>
                    <div className="dropdown-content">
                        <a onClick={() => {
                             setJsxOrders(false)
                            setStats(<img src={Stats}/>)
                        }} >Продажи</a>
                        <a href="#">Бронь</a>
                        <a href="#">Заказы</a>
                    </div>
                    </div>
                
               
                <div className="dropdown">
                    <div className="dropbtn"> Персонал</div>
                    <div className="dropdown-content">
                        <a href="#">Продавцы</a>
                    </div>
                    </div>
            </div>
            
            {stats ? <div class="orders">
                    <div class="order-cards">
                        {stats}
                        </div> </div> : null}
            {jsxOrders ?
            
                <div class="orders">
                    <div class="order-cards">
                        {orderNotConfirm ?
                        
                        orderNotConfirm.map(item => {
                            return <PoccesingCard item={item} type={'table'}/>
                        })
                        
                        : null}
                        {orderDishNotConfirm ?
                        
                        orderDishNotConfirm.map(item => {
                            return <PoccesingCard item={item} type={'dishes'}/>
                        })
                        
                        : null}
                    </div> 
                </div>
            
            
            : null}

        </div>
        </UserProvider>

    )

}