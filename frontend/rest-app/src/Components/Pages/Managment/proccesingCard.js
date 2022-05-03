import './Managment.css';
import { toast } from 'wc-toast'
export default function PoccesingCard(props){
    return (

        <div class="ordercard yellow">
            <wc-toast></wc-toast>
  <div class="card-content">
    <div class="card-content__header">
      <span class="card-status">{props.item.status}</span><span class="card-curr">$</span>{props.item.price}<span class="card-curr__frac">.00</span>
    </div>
    <div class="card-content__body">
      <ul class="card-content__body-list">
        <li class="card-content__body-list-item">order date: {props.item.date}</li>
        <li class="card-content__body-list-item">order ID: #{props.item.id}</li>
        <li class="card-content__body-list-item">

            {props.item.details.map(item => {
                return <div class="card-content__body-list-item">
                    {item.table_id ?
                    
                    <span class="card-content__body-list-item-name">Стол №{item.table_id}</span>
                    
                    :
                    <div>
                        <span class="card-content__body-list-item-name">Блюдо:{item.dish_name}     </span>
                        <span class="card-content__body-list-item-name">{item.quantity} шт.</span>
                    </div>
                    
                    }
                </div>
            })}
        </li>
      </ul>
      <div class="card-content__body-button">
        <button onClick={async () => {

            await fetch(`http://localhost:8000/api/order/update-order`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('Token')
                },
                body: JSON.stringify({
                    order_id: props.item.id,
                    order_type: props.type,
                    details: props.item.details,
                })
            }).then(res => res.json()).then(data => {
                if (data) {
                    toast.success('Заказ обработан');
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000)
                }
                else{
                    toast.error('Ошибка обработки заказа');
                }
            })

        }}>Потвердить</button>
      </div>
    </div>
  </div>
</div>

    )
}