import "./balance.scss"
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {MyContext} from "../../app/App";

const Balance = () =>{
    let value = useContext(MyContext);
    const [MainList, setMainList]=useState([]);
    const [MainListBalance, setMainListBalance]=useState([]);

    const [day,setDay]= useState("");
    const [moth,setMonth]= useState("");
    const [year,setYear]= useState("");

    useEffect(() => {
        axios.get(`${value.url}dashboard/payments/`, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then((response) => {
            setMainList(response.data.itmes);
            setMainListBalance(response.data.balance)
        }).catch((error) => {
            if (error.response.statusText == "Unauthorized") {
                window.location.pathname= "/";
                localStorage.removeItem("token");
            }
        });

    }, []);

    const filter = () =>{
        axios.get(`${value.url}dashboard/payments/`, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            },
            params: {day: day, month: moth, year: year}
        }).then((response) => {
            setMainList(response.data.itmes);
            setMainListBalance(response.data.balance)
        }).catch(() => {

        });

    };



    return <div className="balance-container">
        <div className="header-side">
            <div className="filter-box">
                <div className="inputs">
                    <input onChange={(e)=>setDay(e.target.value)} min={1} max={31} placeholder="kun" type="number"/>
                    <input onChange={(e)=>setMonth(e.target.value)} min={1} max={12} placeholder="oy" type="number"/>
                    <input onChange={(e)=>setYear(e.target.value)} min={2017} max={2050} placeholder="yil" type="number"/>
                </div>
                <div className="filter-btn">
                    <img onClick={filter} src="../images/admin/filter.png" alt=""/>
                </div>
            </div>
            <div className="main-price">Umumiy balans: {MainListBalance}</div>
        </div>

        <div className="table-content">
            <table>
                <thead>
                <tr>
                    <th>№</th>
                    <th>Balans id</th>
                    <th>Sana</th>
                    <th>Narx</th>
                    <th>Status</th>
                </tr>
                </thead>

                <tbody>
                {
                    MainList.map((item, index) => {
                        return <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.balance_id}</td>
                            <td>{item.date}</td>
                            <td>{item.amount}</td>
                            <td>{item.status}</td>
                        </tr>
                    })
                }
                </tbody>
            </table>
        </div>
    </div>
};

export default Balance