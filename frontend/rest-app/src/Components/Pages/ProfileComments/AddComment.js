import './ProfileComments.css';
import Avatar from  '../../../Assets/sh.jpg'
import { useState } from 'react';
import { toast } from 'wc-toast'
import { sendComment } from './commentsdb';

export default function AddComment(props){
    const [addComment, setAddComment] = useState('')
    const [showOrder, setShowOrder] = useState(false)
    const [selectOrder, setSelectOrder] = useState(null)


    const handleSendComment = async () => {

        await sendComment(
            localStorage.getItem('Token'),
            {
                order_id: selectOrder,
                comments: addComment,
                user_id: props.user.user_id
            }
        ).then(data => {
            if(data){
                toast.success('Комментарий добавлен')
                window.location.reload()
            }
        })

    }

    return (
        <ul id="comments-list" className="comments-list">
                    <li>
                    <wc-toast></wc-toast>
                        <div className="comment-main-level">
                            <div className="comment-avatar"><img src={Avatar} alt=""/></div>
                                
                                <div className="comment-box">
                                    <div className="comment-head">
                                        <h6 className="comment-name by-author"><a className='ctest'>{props.user.user_login}</a></h6>
                                        <i className="fa fa-reply"
                                        
                                        onClick={() => {
                                            {selectOrder != null && addComment !== '' ? 
                                            handleSendComment()
                                            : 
                                            toast.error('Выберите заказ и напишите комментарий')
                                        }
                                        }}
                                        
                                        >Добавить</i>
                                        <i className="fa fa-heart" onClick={() => {
                                            setShowOrder(!showOrder)
                                        }}
                                        >Выбрать заказ {showOrder ? 
                                        
                                            <div className="orders-w">
                                                {props.orderTable ?
                                                    props.orderTable.map(elem => {
                                                        return (
                                                            <div onClick={() => {
                                                                setSelectOrder(elem.id)
                                                                toast(`Вы выбрали заказ № ${elem.id}`)
                                                                }}>
                                                                № {elem.id}
                                                            </div>
                                                        )
                                                    })
                                                
                                                : null}
                                                {props.orderDishes ?
                                                    props.orderDishes.map(elem => {
                                                        return (
                                                            <div onClick={() => {
                                                                setSelectOrder(elem.id)
                                                                toast(`Вы выбрали заказ № ${elem.id}`)
                                                                }}>
                                                                № {elem.id}
                                                            </div>
                                                        )
                                                    })
                                                : null}
                                                    
                                            </div>
                                        
                                        
                                        : null}</i>

                                    </div>
                                    <div className="comment-content">
                                        <p className="comment-text">Количество символов: {addComment.length} / 155, Заказ №{selectOrder}</p>
                                        <textarea maxLength="155" className="comment-change" 
                                            onChange={(e) => setAddComment(e.target.value)}>   

                                        </textarea>
                                    </div>
                                </div>
                        </div>
                    </li>
                </ul>
    )
}