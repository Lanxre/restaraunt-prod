import './Notify.css';
import { useNavigate } from 'react-router-dom';
import {useState, useEffect} from 'react'

function Notify(props) {
    const {
        initialMinute = 0,
        initialSeconds = 0, 
        initialTitle = '',
        initialContent = undefined,
        initialItem = null,
        optionsType = '',
    } = props;
    const [ minutes, setMinutes ] = useState(initialMinute);
    const [seconds, setSeconds ] =  useState(initialSeconds);
    const [title, setTitle] = useState(initialTitle);
    const [isExist, setIsExist] = useState(false);
    const [item, setItem] = useState(initialItem);
    const [type, setType] = useState(optionsType);
    const navigate = useNavigate();

    useEffect(()=>{
    let myInterval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(myInterval)
                } else {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                }
            } 
        }, 1000)
        return ()=> {
            clearInterval(myInterval);
          };
    });

    return (
        <div className="notify">
        { minutes === 0 && seconds === 0 || isExist
            ? null
            :
            <div className="notify-container">
                <h1> {title}? Оставшееся время: {minutes}:{seconds < 10 ?  `0${seconds}` : seconds}</h1> 
                <div className="notify-answers">
                    <div className="notify-answer-true" onClick={() => {
                        initialContent(
                            localStorage.getItem("Token"),
                            `http://localhost:8000/api/${type}`,
                            item
                        )
                        alert("Удаление прошло успешно");
                        window.location.reload(false);
                    
                    }}>Да</div>
                    <div className="notify-answer-false"
                        onClick={() => {
                            setIsExist(true);
                        }}
                    
                    >Нет</div>
                </div>

            </div>
        }
        </div>
    )
}

export default Notify
