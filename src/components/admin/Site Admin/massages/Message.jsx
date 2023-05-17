import "./style.scss";
import {useContext, useEffect, useState} from "react";
import {MyContext} from "../../../app/App";
import axios from "axios";

const Message = () => {
    let value = useContext(MyContext);
    const [MainList, setMainList] = useState([]);

    useEffect(() => {
        axios.get(`${value.url}dashboard/contactus/`, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then((response) => {
            setMainList(response.data);
        }).catch((error) => {
            if (error.response.statusText == "Unauthorized") {
                window.location.pathname = "/";
                localStorage.removeItem("token");
            }
        });
    }, []);

    const delMessage = (id) =>{
        axios.delete(`${value.url}dashboard/contactus/${id}`).then(()=>{

            axios.get(`${value.url}dashboard/contactus/`, {
                headers: {
                    "Authorization": `Token ${localStorage.getItem("token")}`
                }
            }).then((response) => {
                setMainList(response.data);
            }).catch(() => {
            });
        })

    };

    return <div className="message-container">

        <div className="table-content">
            <table>
                <thead>
                <tr>
                    <th>№</th>
                    <th>Ism/Familiya</th>
                    <th>Tel raqam</th>
                    <th>Xabar</th>
                </tr>
                </thead>

                <tbody>
                {MainList.map((item, index) => {
                    return <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                            {item.first_name} <br/>
                            {item.last_name}
                        </td>
                        <td>{item.phone}</td>
                        <td>
                            <div className="message-box">
                                {item.body}
                            </div>
                        </td>
                        <td>
                            <div>
                                <img onClick={()=>delMessage(item.id)} src="../images/admin/delete.png" alt=""/>
                            </div>
                        </td>

                    </tr>
                })
                }
                </tbody>
            </table>
        </div>
    </div>
};

export default Message