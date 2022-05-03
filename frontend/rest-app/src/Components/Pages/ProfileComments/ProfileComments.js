import './ProfileComments.css';
import Comment from './Comment';
import AddComment from './AddComment';
import { useState, useEffect, useContext } from 'react';
import { UserContext, UserProvider } from '../../../Api/Context/UserContext';
import { fetchUser } from '../../../Api/http/userRequests';
import { getUserComments } from './commentsdb';
import { getUserConfirmOrdersTable, getUserConfirmOrders } from '../ProfileOrders/carddb';
import { useNavigate } from 'react-router-dom';
export default function ProfileComments() {

    const [token, setToken] = useContext(UserContext);
    const [user, setUser] = useState({})
    const [comments, setComments] = useState([])

    const [confirmOrder, setConfirmOrder] = useState([])
    const [confirmOrderTable, setConfirmOrderTable] = useState([])

    const navigate = useNavigate();

    useEffect(async () => {
        if(token){
            await fetchUser(token).then(data => {
                setUser(data)
            })
            await getUserComments(token).then(data => {
                setComments(data)
            })
            await getUserConfirmOrdersTable(token).then(data => {
                if(data.detail !==  'Order detail not found'){
                    setConfirmOrderTable(data)
                }
            })
            await getUserConfirmOrders(token).then(data => {
                if(data.detail !==  'Order detail not found'){
                    setConfirmOrder(data)
                }
            })
        }
        else{
            navigate('/')
        }
        
    }, [token]);


    return (
        <UserProvider>
            <div className="comments-container">
                <ul id="comments-list" className="comments-list">
                    {comments ? comments.map(elem => {
                        return <Comment user={user} comment={elem} />
                    }) : null}
                </ul>
                <AddComment user={user}
                            orderTable={confirmOrderTable}
                            orderDishes={confirmOrder}/>

            </div>
        </UserProvider>
    )
}