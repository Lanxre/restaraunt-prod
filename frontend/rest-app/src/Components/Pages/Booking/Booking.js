import React from 'react';
import ImageMapper from 'react-img-mapper';
import './Booking.css';
import ShemeBooking from '../../../Assets/sxema-yas.jpg';
import DeleteButton from '../../../Assets/delete-button.svg';
import {map} from './map';
import { fetchTables } from './dbtables';
import {useState, useEffect, useContext} from 'react';
import {UserContext, UserProvider} from "../../../Api/Context/UserContext";
import Loader from "../../../Components/Loader/Loader";
import { toast } from 'wc-toast'

function Booking(){

    const [token, setToken] = useContext(UserContext);
    const [imgMap, setImgMap] = useState(null);
    const [tables, setTables] = useState([]);
    const [orderTables, setOrderTables] = useState([]);

    useEffect(() => {

        setTimeout(async () => {
            fetchTables(token).then(data => {
                setTables(data)
                for(let i = 0; i < data.length; i++){
                
                    if(data[i].table_availability === 'True'){
                        map.areas[i].fillColor = 'rgba(0, 255, 0, 0.5)';
                        map.areas[i].availability = 'True'
                    }
                    else{
                        map.areas[i].fillColor = 'rgba(255, 0, 0, 0.5)';
                        map.areas[i].availability = 'False'
                    }
                }
                setImgMap(<ImageMapper
                    src={ShemeBooking}
                    map={map}
                    onClick={(area) => {
                        if(area.availability === 'True'){
                            setOrderTables(orderTables => {
                                if(orderTables.length < 5 && !orderTables.some(el => el === area)){
                                    return [area, ...orderTables];
                                }
                                if(orderTables.length === 5){
                                    toast.error('Вы не можете забронировать больше 5 столов')
                                }
                                if(orderTables.some(el => el === area)){
                                    toast.error('Вы уже забронировали этот стол')
                                }

                                return orderTables
                            })
                            
                        }
                        else{
                            toast.error(
                                `Стол № ${area.name} занят`
                            );
                        }
                    }} 
                    width={900}
                    height={681}/>)
            })
        }
        , 1000);

    }, [orderTables]);
    

    return (
        <UserProvider>
            <wc-toast></wc-toast>
            <div className="main-booking">
            <div className="scheme-booking">
                <div className="scheme-booking-img">
                    {imgMap ? imgMap : <Loader/>}
                </div>
            </div>
            <div className="scheme-booking">
                <div className='booking-order'
                style={{
                    visibility: `${orderTables.length > 0 ? 'visible' : 'hidden'}`,
                    opacity: `${orderTables.length > 0 ? '1' : '0'}`
                }}
                   
                >
                    <div className='booking-order-content'>
                        <div className='booking-order-content-title'>
                            Выбранные места
                        </div>
                    </div>

                    {
                        orderTables ? orderTables.map((table, index) => {
                            return (
                                <div className='booking-order-content' key={table.name}>
                                    <div className='booking-order-info'>
                                        <div className='booking-order-content-title'>
                                            Стол № {table.name}
                                        </div>
                                        <div className='booking-order-content-title'>
                                            Стоимость: {table.name < 8 ? '5 $' : '10 $'}
                                        </div>
                                    </div>
                                    <div className='booking-order-info'>
                                        <img src={DeleteButton}
                                        onClick={() => {
                                            setOrderTables(orderTables.filter(elem => elem !== table))
                                        }}
                                        ></img>
                                    </div>
                                </div>
                            )
                        }) : null
                    }
                    

                    <div className='booking-order-content'
                    style={
                        {marginTop:'auto',
                        marginBottom:'5px'}
                    }>
                        <div className='booking-make-order'>
                            Заказать
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </UserProvider>
    );
}
export default Booking;