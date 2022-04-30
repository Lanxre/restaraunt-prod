import './AdminDetail.css';
import {useParams, useNavigate} from 'react-router-dom';
import React, {useState, useContext, useEffect} from "react";
import {UserContext, UserProvider} from "../../../../Api/Context/UserContext";
import {
    fetchUser,
    fetchUserById,
    fetchUserUpdate,
    fetchAdministratorById,
    fetchManagerById,
    fetchCustomerById,
    fetchUpdateObject,
} from "../../../../Api/http/userRequests";
import {Role} from "../../../../Api/Enums/Enum";
import { toast } from 'wc-toast'

function AdminDetail({type}){

    const [token] = useContext(UserContext);
    const params = useParams();
    const [user, setUser] = useState({})
    const [data, setData] = useState({})
    const navigate = useNavigate();
    useEffect(() => {
        if(token){
            fetchUser(token).then(data => {
                setUser(data)
            })
            
            switch(type){

                case 'Admin':
                    fetchAdministratorById(token, params.id).then(data => {
                        setData(data)
                    })
                    break;
                
                case 'Manager':
                    fetchManagerById(token, params.id).then(data => {
                        setData(data)
                    })
                    break;
                
                case 'Customer':
                    fetchCustomerById(token, params.id).then(data => {
                        setData(data)
                    })
                    break;

                case 'User':
                    fetchUserById(token, params.id).then(data => {
                        setData(data)
                    })
                    break;
                
                default:
                    setData(null)

            }
            
        }
        else{
            navigate('/login')
        }

    }, [token]);

    const updateObject = async (e) => {
        e.preventDefault();
        switch(type){

            case 'Admin':
                fetchUpdateObject(token, 'http://localhost:8000/api/administrators',data, params.id)
                    .then(data => {
                        toast.success('Update success');
                        setData(data)
                    })
                break;
            
            case 'Manager':
                fetchUpdateObject(token, 'http://localhost:8000/api/managers',data, params.id)
                    .then(data => {
                        toast.success('Update success');
                        setData(data)
                    })
                break;
            
            case 'Customer':
                fetchUpdateObject(token, 'http://localhost:8000/api/customers',data, params.id)
                    .then(data => {
                        toast.success('Update success');
                        setData(data)
                    })
                break;

            case 'User':
                fetchUserUpdate(token, data)
                    .then(data => {
                        toast.success('Update success');
                        setData(data)
                    })
                break;
            
            default:
                setData(null)

        }
    }
    
    return (
        <UserProvider>
            <div>
            {
                user.role_id !== Role.Admin ? navigate('/profile') :
                <div className='login-box'>
                    <wc-toast></wc-toast>
                    <form method='put' onSubmit={updateObject} >
                        <h2>Обновление объекта, тип: {type}</h2>

                        {
                        Object.keys(data).map(key => {

                            if(!key.includes('id')){

                                return (
                                    <div className="user-box">
                                        <input type='text' name={key}
                                               placeholder={key}
                                               value={data[key]}
                                               onChange={e => {
                                                   setData({...data, [key]: e.target.value})
                                               }} />
                                    </div>
                                )
                            }
                        
                        })}

                        
                        <input type="submit" value="Сохранить"/>
                    </form>
                </div>

            }
            </div>
        </UserProvider>
    )
}

export default AdminDetail;