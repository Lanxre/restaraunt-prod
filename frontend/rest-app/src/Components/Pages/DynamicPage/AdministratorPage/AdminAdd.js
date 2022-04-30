import './AdminDetail.css';
import {useParams, useNavigate} from 'react-router-dom';
import React, {useState, useContext, useEffect} from "react";
import {UserContext, UserProvider} from "../../../../Api/Context/UserContext";
import {
    fetchUser,
    fetchUsers,
    fetchUserById,
    fetchAdministratorById,
    fetchManagerById,
    fetchCustomerById,
    fetchCreateObject
} from "../../../../Api/http/userRequests";
import {Role} from "../../../../Api/Enums/Enum";
import { toast } from 'wc-toast'

function AdminAdd(){

    const [token] = useContext(UserContext);
    const params = useParams();
    const [user, setUser] = useState({})
    const [users, setUsers] = useState([])
    const [data, setData] = useState({})

    const [selected, setSelected] = useState("www.google.com")

    const navigate = useNavigate();
    useEffect(() => {
        if(token){
            fetchUser(token).then(data => {
                setUser(data)
            }).then(() => {
                fetchUsers(token).then(data => {
                    setUsers(data)
                    setSelected(data[0].uesr_email)
                })
            })
            
            switch(params.type){

                case 'administrators':
                    fetchAdministratorById(token, 1).then(data => {
                        setData(data)
                    })
                    break;
                
                case 'managers':
                    fetchManagerById(token, 1).then(data => {
                        setData(data)
                    })
                    break;
                
                case 'customers':
                    fetchCustomerById(token, 1).then(data => {
                        setData(data)
                    })
                    break;

                case 'users':
                    fetchUserById(token, 1).then(data => {
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

    const handleSubmit = (e) => {
        e.preventDefault()

        const sendData = JSON.parse(JSON.stringify(data));
        const userq = users.find(user => user.uesr_email === selected);
        sendData.user_id = userq.user_id;


        fetchCreateObject(token, params.type, sendData).then(data => {
            if(data){
                toast({
                    text: 'Successfully created',
                    type: 'success',
                    delay: 3000
                })
                navigate('/administration')
            }
            else{
                toast({
                    text: 'Error',
                    type: 'error',
                    delay: 3000
                })
            }
        })
    }

    const handleSubmitUsers = (e) => {
        e.preventDefault()

        const sendData = {
            username: data.user_login,
            email: data.uesr_email,
            password: data.user_password
        }

        fetchCreateObject(token, params.type, sendData).then(data => {
            if(data){
                toast.success('Create success');
                navigate('/administration')
            }
            else{
                toast.error('Update error');
            }
        })
    }

    return (
        <UserProvider>
            <div>
            {
                user.role_id !== Role.Admin ? navigate('/profile') :
                <div className='login-box'>
                    <wc-toast></wc-toast>
                    <form method='post' onSubmit={params.type === 'users' ? handleSubmitUsers : handleSubmit}>
                        <h2>Добавление объекта, тип: {params.type}</h2>

                        {
                        Object.keys(data).map(key => {

                            if(!key.includes('id')){

                                return (
                                    <div className="user-box">
                                        <input type='text' name={key}
                                               placeholder={key}
                                               required = "required"
                                               onChange={e => {
                                                   setData({...data, [key]: e.target.value})
                                               }} />
                                    </div>
                                )
                            }
                        
                        })}
                        {params.type === 'users' ? null :
                        <div className="user-box">
                            <select 
                                    onChange={e => {setSelected(e.target.value)}}
                                    >
                                    {
                                    users.map(user => {
                                         return <option name={'uesr_email'}
                                                        value={user.uesr_email}>
                                                    {user.uesr_email}
                                                </option>
                                    })}
                            </select>
                        </div>
                        
                        }

                        
                        <input type="submit" value="Сохранить"/>
                    </form>
                </div>

            }
            </div>
        </UserProvider>
    )
}

export default AdminAdd;