import {Route, Routes} from "react-router-dom";
import HomePage from "../../Components/Pages/HomePage";
import LoginWrapper from "../../Components/Auth/Login";
import ProfilePage from "../../Components/Pages/ProfilePage";
import Administration from "../../Components/Pages/Administration";
import AdminDetail from "../../Components/Pages/DynamicPage/AdministratorPage/AdminDetail";
import AdminAdd from "../../Components/Pages/DynamicPage/AdministratorPage/AdminAdd";
import Booking from "../../Components/Pages/Booking/Booking";
import Menu from "../../Components/Pages/Menu/Menu";

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

                <Route path="/menu"/>
                <Route path="/contact"/>
            </Routes>
    );
}

export default Routing;
