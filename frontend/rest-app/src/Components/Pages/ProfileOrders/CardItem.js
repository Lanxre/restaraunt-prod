import './ProfileOrders.css';
import Warning from '../../../Assets/warning.png';
import Confirm from '../../../Assets/confirm.jpg';
export default function CardItem(props) {
    return (
        <li class="cards__axis">
        <figure class="cards__front">
          <img src={props.item.status == 'Ожидание подтверждения' ? Warning : 'Потверждено' ? Confirm : null} alt=""/>
          <figcaption class="cards__description--front">
            <p>Индефекатор заказа № {props.item.id}</p>
          </figcaption>
        </figure>
        <figure class="cards__back">
          <img src={props.item.status == 'Ожидание подтверждения' ? Warning : 'Потверждено' ? Confirm : null} alt=""/>
          <figcaption class="cards__description--back">
            <p>Статус: {props.item.status}
            <br></br> Дата заказа: {props.item.date}
            <br></br> Сумма заказа: {props.item.price} $
            {props.item.manager_id || props.item.sale_person_id ?
            <div>
                <span>Менеджер: {props.item.manager_id}</span>
                <span>Продавец: {props.item.sale_person_id}</span>
            </div>
            
            : null}
            {props.item.details.map(item => {
                return <div>
                    {item.dish_name ? <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}>
                    <span>{item.dish_name}</span>
                    <span>{item.quantity} шт.</span>
                    <span>{item.total_price} $</span>
                    </div> : 
                    
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                        <span>Стол №{item.table_id}</span>
                    </div>
                    
                    
                    }
                    
                </div>
            })}
            
            
            </p>
            
          </figcaption>
        </figure>
      </li>
    )

}