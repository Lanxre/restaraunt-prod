import './ProfileComments.css';
import Avatar from  '../../../Assets/sh.jpg'
import { useState} from 'react';
import { updateComment, deleteComment } from './commentsdb';
import { toast } from 'wc-toast'

export default function Comments(props) {

    const [showRedact, setShowRedact] = useState(false)
    const [redactComment, setRedactComment] = useState('')

    const handleRedactComment = async () => {
        await updateComment(
            localStorage.getItem('Token'),
            props.comment.id,
            {
                comments: redactComment
            }
        ).then(data => {
            if(data){
                toast.success('Комментарий обновлен')
                window.location.reload()
            }
        })
    } 

    const handleDeleteComment = async (id) => {
        await deleteComment(
            localStorage.getItem('Token'),
            id
        ).then(data => {
            if(data){
                toast.success('Комментарий удален')
                window.location.reload()
            }
        })
    }


    return (
        <li>
            <div className="comment-main-level" style={{userSelect: 'none'}}>
                <wc-toast></wc-toast>
                <div className="comment-avatar"><img src={Avatar} alt=""/></div>
					
					<div className="comment-box">
						<div className="comment-head">
							<h6 className="comment-name by-author"><a className='ctest'>{props.user.user_login}</a></h6>
							<i className="fa fa-reply" onClick={() => {
                                setShowRedact(!showRedact)
                            }} >{!showRedact ? 'Редактировать' : <div style={{
                                display: 'flex',
                                flexDirection: 'row',
                                
                            }}>
                                <div style={{marginRight: '10px'}}>Отменить</div>
                                <div onClick={() => {
                                    if(redactComment !== ''){
                                        handleRedactComment()
                                    } else {
                                        toast.error('Введите комментарий')
                                    }
                                }}>Изменить</div>  
                                
                                <div style={{marginLeft: '10px'}} 
                                onClick={() => {
                                     if(localStorage.getItem('Token')){
                                        handleDeleteComment(props.comment.id)
                                     } else {
                                            toast.error('Войдите в систему')
                                    }
                                }}>
                                    Удалить
                                </div>


                            </div>}</i>
							<i className="fa fa-heart">Заказ №{props.comment.order_id}</i>
						</div>
						{!showRedact ? <div className="comment-content">
							{props.comment.comments}
						</div> :
                            <div className="comment-content">
                            <p className="comment-text">Редактирование комментария для заказ № {props.comment.order_id}</p>
                            <textarea maxLength="155" className="comment-change"
                             onChange={(e) => {setRedactComment(e.target.value)}}>   
                                    {props.comment.comments}
                            </textarea>
                        </div>
                        
                        }
					</div>
            </div>
        </li>
    )

}