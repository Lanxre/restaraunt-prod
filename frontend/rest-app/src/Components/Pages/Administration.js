import React, {useState, useContext, useEffect} from "react";
import {UserContext, UserProvider} from "../../Api/Context/UserContext";
import Loader from "../../Components/Loader/Loader";
import Table from "../Tables/Table";
import {
        fetchAdministrator, 
        fetchCustomer,
        fetchManager,
        fetchUser,
        fetchUsers
} from "../../Api/http/userRequests";
import './Administration.css'
import {Role} from "../../Api/Enums/Enum";
import {useNavigate} from "react-router-dom";
function Administration(){

    const [token] = useContext(UserContext);
    const [user, setUser] = useState({})
    const [isLoading, setLoading] = useState(false);
    const [data, setData] = useState()
    const navigate = useNavigate();

    useEffect(() => {
        if(token){
            fetchUser(token).then(data => {
                setUser(data)
            })
        }
        else{
            navigate('/login')
        }

    }, [token]);

    async function getData(type){
        setData(null)
        setLoading(true);
        setTimeout(async () => {
            setLoading(false)
            switch (type){
                case 'Admin': 
                    const admin = await fetchAdministrator(token);
                    setData(<Table prop={admin}
                                   type={'administrators'}/>)
                    break

                case 'Users': 
                    const users = await fetchUsers(token);
                    setData(<Table prop={users}
                                   type={'users'}/>)
                    break
                
                case 'Managers': 
                    const managers = await fetchManager(token);
                    setData(<Table prop={managers}
                                   type={'managers'}/>)
                    break
                
                case 'Customer': 
                    const customer = await fetchCustomer(token);
                    setData(<Table prop={customer}
                                   type={'customers'}/>)
                    break
                
                default:
                    setData(null)
                    break

            }

        }, 3000);

    }

    


    return (
        <UserProvider>
            {
                user.role_id !== Role.Admin ? navigate('/profile') : <div>
            <div className="admin-panel">
                    <div className="admin-panel-title" onClick={() => getData("Users")}>Users</div>
                    <div className="admin-panel-title" onClick={() => getData("Admin")}>Administrators</div>
                    <div className="admin-panel-title" onClick={() => getData("Managers")}>Managers</div>
                    <div className="admin-panel-title" onClick={() => getData("Customer")}>Customer</div>
                </div>
                <div>
                    {isLoading ? <Loader/> : data ? data : null}
                </div>
            </div>
            }
        </UserProvider>


    )

}

export default Administration;