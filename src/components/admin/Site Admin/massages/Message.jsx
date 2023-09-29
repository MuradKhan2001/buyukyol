import "./style.scss";
import {useContext, useEffect, useState} from "react";
import {MyContext} from "../../../app/App";
import axios from "axios";

const Message = () => {
    let value = useContext(MyContext);
    const [MainList, setMainList] = useState([]);
    const [menu,setMenu]= useState(false);

    const getList = () =>{
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
    };

    useEffect(() => {
       getList()
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

        <div className="header-side">
            <div onClick={()=>setMenu(false)} className={`menu ${!menu ? "active-menu" : ""}`}>
                Yangi kontakt va takliflar
            </div>
            <div onClick={()=>setMenu(true)} className={`menu ${menu ? "active-menu" : ""}`}>
                Ko'rilgan kontakt va takliflar
            </div>
        </div>

        {
            menu ? <div className="table-content">
                <table>
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Ism/Familiya</th>
                        <th>Tel raqam</th>
                        <th>Xabar</th>
                        <th>Kelgan vaqt</th>
                        <th>O'chirish</th>
                    </tr>
                    </thead>

                    <tbody>
                    {MainList.map((item, index) => {
                        {if (item.read){
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
                                <td>{item.date}</td>
                                <td>
                                    <div>
                                        <img onClick={()=>delMessage(item.id)} src="../images/admin/delete.png" alt=""/>
                                    </div>
                                </td>

                            </tr>
                        }}
                    })
                    }
                    </tbody>
                </table>
            </div> : <div className="table-content">
                <table>
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Ism/Familiya</th>
                        <th>Tel raqam</th>
                        <th>Xabar</th>
                        <th>Kelgan vaqti</th>
                        <th>Tasdiqlash</th>
                    </tr>
                    </thead>

                    <tbody>
                    {MainList.map((item, index) => {
                       if (item.read === false){
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
                               <td>{item.date}</td>
                               <td>
                                   <div>
                                       <div>
                                           {item.read ? <img onClick={() => {
                                                   axios.post(`${value.url}dashboard/contactus/${item.id}/verify/`, {}, {
                                                       headers: {
                                                           "Authorization": `Token ${localStorage.getItem("token")}`
                                                       }
                                                   }).then(() => {
                                                       getList()
                                                   })
                                               }} src={`../images/admin/verified.png`} alt=""/> :

                                               <img onClick={() => {
                                                   axios.post(`${value.url}dashboard/contactus/${item.id}/verify/`, {}, {
                                                       headers: {
                                                           "Authorization": `Token ${localStorage.getItem("token")}`
                                                       }
                                                   }).then(() => {
                                                       getList()
                                                   })
                                               }} src={`../images/admin/verified1.png`} alt=""/>}
                                       </div>
                                   </div>
                               </td>

                           </tr>
                       }
                    })
                    }
                    </tbody>
                </table>
            </div>
        }


    </div>
};

export default Message