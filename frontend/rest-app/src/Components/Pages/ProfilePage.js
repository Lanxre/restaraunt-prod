import React, {useState, useContext, useEffect} from "react";
import {UserContext, UserProvider} from "../../Api/Context/UserContext";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import './ProfilePage.css'


function ProfilePage() {
    const [token, setToken] = useContext(UserContext);
    const [user, setUser] = useState({})
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    useEffect(() => {
        const fetchUser = async () => {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            };
            const response = await fetch("http://127.0.0.1:8000/api/users/me", requestOptions);
            const data = await response.json();
            if (response.ok) {
                setUser(data)
                setUsername(data.user_login)
            }

        };
        fetchUser();
    }, []);


    const [readonly, setReadOnly] = useState('readonly')
    const redInfo = (e) => {
        setReadOnly(!readonly)
        e.preventDefault();
    }
    const updateSumbit  = async () => {
        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            }, body: JSON.stringify({
                    username: username,
                    email: user.uesr_email,
                    password: password

                }
            ),
        };
        const response = await fetch("http://localhost:8000/api/users/", requestOptions);
        const data = await response.json();
        if (response.ok) {
            setToken(data.access_token)
        }
    };


    return (
        <UserProvider>
            {!token ? (<Navigate to='/login' />) : (
                <div className="profile-body">
                    <div className="profile-main">
                        <div className="profile-upper">
                            <img src={require("../../Assets/sh.jpg")} className="profile-avatar" alt='Avatar'/>
                            <form onSubmit={updateSumbit}>
                                <input className="profile-input" type="text" name="username" required="" readOnly={readonly} value={username}
                                       onChange={(e) => setUsername(e.target.value)}/>
                                <input className="profile-input" type="email" name="email" required="" readOnly={readonly} value={user.uesr_email}
                                style={{color: !readonly ? 'red' :'black'}}/>
                                <label className='profile-label' style={{display: !readonly ? 'flex' : 'none'}} >Новый пароль</label>
                                <input className="profile-input"  style={{display: !readonly ? 'block' : 'none'  }}
                                       required="" readOnly={readonly} type="password"
                                       onChange={(e) => setPassword(e.target.value)}/>
                                <button style={{display: !readonly ? 'block' : 'none'  }} type="submit"> Сохранить</button>
                            </form>


                            <button onClick={redInfo}>{readonly ? 'Редактировать' : 'Отменить'} </button>
                            <button style={{display: readonly ? 'block' : 'none'  }}>Ваши заказы</button>
                            <button style={{display: readonly ? 'block' : 'none'  }}>Отзыв</button>
                            <button onClick={ () => {
                                localStorage.removeItem('Token')
                                setToken(null)
                            }} style={{display: readonly ? 'block' : 'none'  }}>Выйти из аккаунта</button>

                        </div>
                    </div>
                </div>)}

        </UserProvider>
    );
}

export default ProfilePage;