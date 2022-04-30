import {useState} from "react";
import { useNavigate } from 'react-router-dom';
import Notify from "../Notification/Notify";
import { fetchDeleteObject } from "../../Api/http/userRequests";
import './Table.css';

function Table(prop) {
    const [data, setData] = useState(prop)
    const [notify, setNotify] = useState(null)
    const [colspan, setColspan] = useState(() => {
        let cols = 0
        Object.keys(data.prop.find(e => true)).map(elem => {
            if(!elem.includes('id')){
                cols = cols + 1
            }
        })
        return cols + 1
    })
    const navigate = useNavigate();
    return (
        <div>
            {notify ? notify : null}
             <div className="tbl-header">
                    <table cellPadding="0" cellSpacing="0" border="0">
                    <thead>
                        <tr>
                            {Object.keys(data.prop.find(e => true)).map(elem => {
                                if(!elem.includes('id')){
                                    return <th>{elem}</th>
                                }
                            })}
                            <th>Modify</th>
                        </tr>
                    </thead>
                    </table>
                </div>
                <div className="tbl-content">
                    <table cellPadding="0" cellSpacing="0" border="0">
                    <tbody>
                        {data.prop.map(elem => <tr>
                            {
                            Object.values(elem).map(e => {
                                if(!Object.keys(elem).find(key => elem[key] === e).includes('id')){
                                    return <td>{e}</td>
                                }
                            })}
                            <th>
                                <div className={'icons'}>
                                    <div className="updateIcon">
                                        <img src={require("../../Assets/update-icon-12.jpg")} alt={'UPDATE'}
                                             onClick={() => navigate(`/administration/${prop.type}/${
                                                 elem[['user_id', 'customer_id', 'id', 'administrator_id'].find(
                                                     key => {
                                                         if(key in elem) {
                                                             return elem[key];
                                                         }
                                                     }
                                                 )]
                                             }`)}/>
                                    </div>
                                    <div className="deleteIcon">
                                        <img src={require("../../Assets/img_216917.png")} alt={'DELETE'}
                                            onClick={() => {
                                                window.scrollTo({top: 0, behavior: 'smooth'});
                                                setNotify(<Notify initialSeconds={3}
                                                                  initialTitle={'Удалить объект'}
                                                                  initialContent={fetchDeleteObject}
                                                                  initialItem={elem}
                                                                  optionsType={prop.type}
                                                                  />)
                                                let interval = setInterval(() => {
                                                    setNotify(null);
                                                    clearInterval(interval);
                                                }
                                                , 3000);
                                            }}/>
                                    </div>
                                </div>
                            </th>
                        </tr>
                        )}
                        <tr className="create-object">
                            <th colSpan={colspan}>
                                <div onClick={() => {
                                    navigate(`/administration/${prop.type}`)
                                }}>
                                    Добавить новый объект
                                </div>
                            </th>
                        </tr>
                    </tbody>
                    </table>
                </div>
        </div>
    )
}

export default Table;