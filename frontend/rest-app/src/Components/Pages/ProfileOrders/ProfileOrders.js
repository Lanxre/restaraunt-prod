import './ProfileOrders.css';
import CardItem from './CardItem';
import { useContext, useEffect, useState } from 'react';
import {UserContext, UserProvider} from "../../../Api/Context/UserContext";
import { fetchUser } from '../../../Api/http/userRequests';
import { 
        getUserNotConfirmOrders,
        getUserConfirmOrders,
        getUserConfirmOrdersTable,
        getUserNotConfirmOrdersTable
} from './carddb';
import { useNavigate } from 'react-router-dom';

export default function  ProfileOrders(){
    const [token, setToken] = useContext(UserContext);
    const [user, setUser] = useState({})
    const navigate = useNavigate();

    const [notConfirmOrder, setNotCofirmOrder] = useState([])
    const [ConfirmOrder, setConfirmOrder] = useState([])
    const [notConfirmTableOrder, setNotCofirmTableOrder] = useState([])
    const [ConfirmTableOrder, setConfirmTableOrder] = useState([])

    useEffect(async () => {
        await fetchUser(token).then(data => {
            setUser(data)
        })
        await getUserNotConfirmOrders(token).then(data => {
            if(data.detail !==  'Order detail not found'){
                setNotCofirmOrder(data)
            }
        })
        await getUserConfirmOrders(token).then(data => {
            if(data.detail !==  'Order detail not found'){
                setConfirmOrder(data)
            }
        })
        await getUserConfirmOrdersTable(token).then(data => {
            if(data.detail !==  'Order detail not found'){
                setConfirmTableOrder(data)
            }
        })
        await getUserNotConfirmOrdersTable(token).then(data => {
            if(data.detail !==  'Order detail not found'){
                setNotCofirmTableOrder(data)
            }
        })
            

    }, [token]);
    


    return (
        <UserProvider>
            {user ?
            <div className="cards">
                {notConfirmOrder || ConfirmOrder ? 
                
                    <div className="order">
                        <div className="order-component">
                            <span className="order-logo">Ваши заказы</span>
                        </div>
                        <div className="order-component-list" style={{
                            height: 'auto',
                            background: 'gray',
                        }}>
                            {notConfirmOrder.map(item => {
                                return <CardItem item={item}/>
                            })}
                            {ConfirmOrder.map(item => {
                                return <CardItem item={item}/>
                            })}
                            {notConfirmTableOrder.map(item => {
                                return <CardItem item={item}/>
                            })}
                            {ConfirmTableOrder.map(item => {
                                return <CardItem item={item}/>
                            })}
                        </div>
                   </div>
                
                :
                 <div className="order">
                        <div className="order-component">
                            <span className="order-logo">У вас нет заказов</span>
                        </div>
                        <div className="order-component-list" style={{
                            height: '500px',
                        }}></div>
                   </div>}
            </div>
            : navigate('/')}
        </UserProvider>
    )
}