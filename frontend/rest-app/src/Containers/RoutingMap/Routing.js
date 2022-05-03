import {Route, Routes} from "react-router-dom";
import HomePage from "../../Components/Pages/HomePage";
import LoginWrapper from "../../Components/Auth/Login";
import ProfilePage from "../../Components/Pages/ProfilePage";
import Administration from "../../Components/Pages/Administration";
import AdminDetail from "../../Components/Pages/DynamicPage/AdministratorPage/AdminDetail";
import AdminAdd from "../../Components/Pages/DynamicPage/AdministratorPage/AdminAdd";
import Booking from "../../Components/Pages/Booking/Booking";
import Menu from "../../Components/Pages/Menu/Menu";
import Order from "../../Components/Pages/Orders/Order";
import ProfileOrders from "../../Components/Pages/ProfileOrders/ProfileOrders";
import ProfileComments from "../../Components/Pages/ProfileComments/ProfileComments";
import ErrorPage from "../ErrorPage/ErrorPage";
import Managment from "../../Components/Pages/Managment/Managment"

function Routing() {

    return (
            <Routes>
                <Route exact path="/" element={<HomePage/>}/>
                <Route exact path="/login" element={<LoginWrapper/>}/>
                <Route exact path="/profile" element={<ProfilePage/>}/>
                <Route exact path="/administration" element={<Administration/>}/>
                <Route exact path="/administration/:type" element={<AdminAdd/>}/>

                <Route exact path="/administration/users/:id" element={<AdminDetail type={"User"}/>}/>
                <Route exact path="/administration/administrators/:id" element={<AdminDetail type={"Admin"}/>}/>
                <Route exact path="/administration/managers/:id" element={<AdminDetail type={"Manager"}/>}/>
                <Route exact path="/administration/customers/:id" element={<AdminDetail type={"Customer"}/>}/>
                

                <Route exact path="/booking" element={<Booking/>}/>
                <Route exact path="/menu" element={<Menu/>}/>
                <Route exact path="/order" element={<Order/>}/>
                <Route exact path="profile/my-order" element={<ProfileOrders/>}/>
                <Route exact path="profile/my-comments" element={<ProfileComments/>}/>
                <Route exact path="/managment" element={<Managment/>}/>

                <Route path="/*"  element={<ErrorPage/>}/>
                
            </Routes>
    );
}

export default Routing;
