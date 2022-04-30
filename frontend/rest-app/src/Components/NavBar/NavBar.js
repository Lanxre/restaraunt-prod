import React, {useState, useContext, useEffect} from "react";
import {NavLink} from "react-router-dom";
import "./NavBar.css";
import {UserContext, UserProvider} from "../../Api/Context/UserContext";
import {fetchUser} from '../../Api/http/userRequests';
import {Role} from '../../Api/Enums/Enum'


function NavBar() {
  const [token, setToken] = useContext(UserContext);
  const [user, setUser] = useState({});
  const [click, setClick] = useState(false);
  useEffect(() => {
      if(token){
        fetchUser(token).then(data => {
          setUser(data)
      })
    }
        
  }, [token]);
  const handleClick = () => setClick(!click);
  return (

    <>
      <UserProvider>
        <nav className="navbar">
          <div className="nav-container">
            <NavLink exact to="/" className="nav-logo">
              LANORE
              <i className="fas fa-code"></i>
            </NavLink>

            <ul className={click ? "nav-menu active" : "nav-menu"}>
              <li className="nav-item">
                <NavLink
                    exact
                    to="/"
                    activeClassName="active"
                    className="nav-links"
                    onClick={handleClick}
                >
                  Главная
                </NavLink>
              </li>
              {
              user.role_id === Role.Admin ? <li className="nav-item">
                <NavLink
                    exact
                    to="/administration"
                    activeClassName="active"
                    className="nav-links"
                    onClick={handleClick}
                >
                  Администрирование
                </NavLink>
              </li> : null
              }
              <li className="nav-item">
                <NavLink
                    exact
                    to="/booking"
                    activeClassName="active"
                    className="nav-links"
                    onClick={handleClick}
                >
                  Бронь
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                    exact
                    to="/menu"
                    activeClassName="active"
                    className="nav-links"
                    onClick={handleClick}
                >
                  Меню
                </NavLink>
              </li>
              <li className="nav-item">
                {token ? (
                    <NavLink
                        exact
                        to="/profile"
                        activeClassName="active"
                        className="nav-links"
                        onClick={handleClick}
                    >
                      Профиль
                    </NavLink>
                ) : (
                    <NavLink
                        exact
                        to="/login"
                        activeClassName="active"
                        className="nav-links"
                        onClick={handleClick}
                    >
                      Вход
                    </NavLink>
                )}
              </li>
            </ul>
            <div className="nav-icon" onClick={handleClick}>
              <i className={click ? "fas fa-times" : "fas fa-bars"}></i>
            </div>
          </div>
        </nav>
      </UserProvider>
    </>
  );
}

export default NavBar;