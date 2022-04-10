import NavBar from '../../Components/NavBar/NavBar'
import { BrowserRouter as Router} from "react-router-dom";
import '../../Components/NavBar/NavBar.css'
import Footer from '../../Components/Footer/Footer';
import './Home.css'
import Routing from "../RoutingMap/Routing";
import {UserProvider} from "../../Api/Context/UserContext";
function Home() {
  return (

    <UserProvider>
        <div className='Site'>
            <Router>
            <NavBar />
            <div className="pages">
                <Routing/>
            </div>
          </Router>
          <div className='Site-content'></div>
          <Footer/>
        </div>
    </UserProvider>
  );
}

export default Home;
