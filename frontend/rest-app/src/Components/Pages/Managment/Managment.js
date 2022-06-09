import './Managment.css';
import { useState, useEffect, useContext } from 'react';
import { 
    notConfirmTableOrder, 
    notConfirmDishOrder, 
    monthSaleStatsOrder,
    monthBookingStatsOrder,
    monthOrderStatsOrder
} from './ordersAllDb';
import { useNavigate } from 'react-router-dom';
import {fetchUser} from '../../../Api/http/userRequests';
import {UserContext, UserProvider} from "../../../Api/Context/UserContext";
import Stats from "../../../Assets/statistics.png";
import  PoccesingCard  from './proccesingCard';
import {
    Chart as ChartJS,
    CategoryScale,
    PointElement,
    LinearScale,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
  
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  
export const options = {
responsive: true,
plugins: {
    legend: {
    position: 'top'
    },
    title: {
    display: true,
    text: 'Статистика ресторана Lanore',
    },
},
};
const labels = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  
export const dataClients = {
    labels,
    datasets: [
        {
            label: 'Общее количество заказов',
            data: [],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
            label: 'Выполненные заказы',
            data: [],
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        }
    ],
};


export default function Managment() {

    const [token, setToken] = useContext(UserContext);
    const [user, setUser] = useState({})
    const [orderNotConfirm, setNotConfirm] = useState([])
    const [orderDishNotConfirm, setOrderDishNotConfirm] = useState([])

    const [isLoading, setLoading] = useState(false)

    const [stats, setStats] = useState(null)
    const [jsxOrders, setJsxOrders] = useState(null)
    const navigate = useNavigate();

    useEffect(async () => {
        if(token && !isLoading) {
            await fetchUser(token).then(data => {
                setUser(data)
            })
            await notConfirmTableOrder(token).then(data => {
                if(data.detail !==  'Order detail not found'){
                    setNotConfirm(data)
                }
            })
            await notConfirmDishOrder(token).then(data => {
                if(data.detail !==  'Order detail not found'){
                    setOrderDishNotConfirm(data)
                }
            })
            setLoading(true)
            
        }
        if(!token) {
            navigate('/')
        }

    }, [token, isLoading])
    return (
        <UserProvider>
            <div className="Managment">
            <div className="manag-nav">
                    <div className="dropdown">
                    <div className="dropbtn"> Заказы</div>
                    <div className="dropdown-content">
                        <a href="#">Все заказы</a>
                        <a style={{cursor: "pointer"}} onClick={() =>{
                            setJsxOrders(true)
                            setStats(false)
                        }}>На рассмотрение</a>
                    </div>
                    </div>

                
                
                <div className="dropdown">
                    <div className="dropbtn"> Статистика</div>
                    <div className="dropdown-content">
                        <a style={{cursor: "pointer"}} onClick={async () => {
                            setJsxOrders(false)
                            setStats()
                            await monthOrderStatsOrder(token).then(data => {
                                dataClients.datasets[0].data = []
                                dataClients.datasets[0].label = 'Количество выполненных заказов'
                                dataClients.datasets[1].data = []
                                dataClients.datasets[1].label = ''
                                
                                for(const month_key in data.total_orders_stats){
                                    if(month_key <= new Date().getMonth() + 1){
                                        dataClients.datasets[0].data.push(data.total_orders_stats[month_key])
                                    }
                                }
                            
                            })
                            setStats(<Line style={{width: '100%', height: '500px'}}
                                               options={options}
                                               data={dataClients} />)
                        }} >Продажи</a>
                        <a style={{cursor: "pointer"}} onClick={async () => {

                            setJsxOrders(false)
                            setStats()
                            await monthBookingStatsOrder(token).then(data => {
                                dataClients.datasets[0].data = []
                                dataClients.datasets[0].label = 'Количество обслужанных столов'
                                dataClients.datasets[1].data = []
                                dataClients.datasets[1].label = ''
                                
                                for(const month_key in data.total_booking_stats){
                                    if(month_key <= new Date().getMonth() + 1){
                                        
                                        dataClients.datasets[0].data.push(data.total_booking_stats[month_key])
                                    }
                                }
                                
                            })
                            setStats(<Line style={{width: '100%', height: '500px'}}
                                options={options}
                                data={dataClients} />)

                        }}>Бронь</a>
                        <a style={{cursor: "pointer"}} onClick={async () => {
                            setJsxOrders(false)
                            setStats()
                            await monthSaleStatsOrder(token).then(data => {
                                dataClients.datasets[0].data = []
                                dataClients.datasets[0].label = 'Общее количество заказов'
                                dataClients.datasets[1].data = []
                                dataClients.datasets[1].label = 'Выполненные заказы'
                            
                                for(const month_key in data.total_sales_stats){
                                    if(month_key <= new Date().getMonth() + 1){
                                        dataClients.datasets[0].data.push(data.total_sales_stats[month_key])
                                        dataClients.datasets[1].data.push(data.total_confirmed_sales_stats[month_key])
                                    }
                                }
                            })
                            setStats(<Bar style={{width: '100%', height: '500px'}}
                                           options={options}
                                           data={dataClients} />)
                        }}>Заказы</a>
                    </div>
                    </div>
                
               
                <div className="dropdown">
                    <div className="dropbtn"> Персонал</div>
                    <div className="dropdown-content">
                        <a href="#">Продавцы</a>
                    </div>
                    </div>
            </div>
            
            {stats ? <div class="orders">
                    <div class="order-cards">
                        {stats}
                        </div> </div> : null}
            {jsxOrders ?
            
                <div class="orders">
                    <div class="order-cards">
                        {orderNotConfirm ?
                        
                        orderNotConfirm.map(item => {
                            return <PoccesingCard item={item} type={'table'}/>
                        })
                        
                        : null}
                        {orderDishNotConfirm ?
                        
                        orderDishNotConfirm.map(item => {
                            return <PoccesingCard item={item} type={'dishes'}/>
                        })
                        
                        : null}
                    </div> 
                </div>
            
            
            : null}

        </div>
        </UserProvider>

    )

}