import {Route, Routes} from "react-router-dom";
import HomePage from "../../Components/Pages/HomePage";
import LoginWrapper from "../../Components/Auth/Login";
import ProfilePage from "../../Components/Pages/ProfilePage";


function Routing() {

    return (
        <Routes>
            <Route exact path="/" element={<HomePage/>}/>
            <Route exact path="/login" element={<LoginWrapper/>}/>
            <Route exact path="/profile" element={<ProfilePage/>}/>
            <Route path="/menu"/>
            <Route path="/contact"/>
        </Routes>
    );
}

export default Routing;
