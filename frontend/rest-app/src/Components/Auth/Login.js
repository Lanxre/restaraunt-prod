import React, { useState, useContext } from "react";
import './Login.css'
import {UserContext, UserProvider} from "../../Api/Context/UserContext";
import { toast } from 'wc-toast'

export default function LoginWrapper(){
    return (
        <UserProvider>
            <Login />
        </UserProvider>
    )
}


function Login() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useContext(UserContext);

    const submitLogin = async () => {   
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: JSON.stringify(
                `grant_type=&username=${email}&password=${password}&scope=&client_id=&client_secret=`
            ),
        };

        const response = await fetch("http://127.0.0.1:8000/api/token", requestOptions);
        const data = await response.json();

        if (!response.ok) {
            toast.error(`Authentication failed: ${data.detail}`); 
            console.log(data.detail)
            
        } else {
            toast.success('Authentication success'); 
            setToken(data.access_token);
            setTimeout(() => {
                window.location.replace('/profile')
            }
            , 1000);

        }
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        submitLogin();

    };

    const submitRegistration = async () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({username: username, email: email, password: password }),
        };

        const response = await fetch("http://127.0.0.1:8000/api/users", requestOptions);
        const data = await response.json();

        if (!response.ok) {
            console.log(data.detail)
            toast.error(`Register failed: ${data.detail}`); 
        } else {
            toast.success('Register success');
            setToken(data.access_token);
            window.location.replace('/profile')
        }
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        submitRegistration();

        

    };
    return (
        <div className="all_body">
                <wc-toast></wc-toast>
                <div className="main">
                    <input type="checkbox" id="chk" aria-hidden="true"/>
                    <div className="signup">
                        <form onSubmit={handleRegisterSubmit}>
                            <label htmlFor="chk" aria-hidden="true">Sign up</label>
                            <input type="text" name="txt" placeholder="User name" required=""
                                   onChange={(e) => setUsername(e.target.value)}/>
                            <input type="email" name="email" placeholder="Email" required=""
                                   onChange={(e) => setEmail(e.target.value)}/>
                            <input type="password" name="pswd" placeholder="Password" required=""
                                   onChange={(e) => setPassword(e.target.value)}/>
                            <button type="submit">Sign up</button>
                        </form>
                    </div>

                    <div className="login">
                        <form onSubmit={handleLoginSubmit}>
                            <label htmlFor="chk" aria-hidden="true">Login</label>
                            <input type="email" name="email" placeholder="Email" required="" 
                                   onChange={(e) => setEmail(e.target.value)}/>
                            <input type="password" name="pswd" placeholder="Password" required=""
                                   onChange={(e) => setPassword(e.target.value)}/>
                            <button type="submit" >Login</button>
                        </form>
                    </div>
                </div>
        </div>

    );
};