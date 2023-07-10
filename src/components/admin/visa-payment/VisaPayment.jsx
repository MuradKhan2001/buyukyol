import "./VisaPayment.scss";
import {useContext, useEffect, useState} from "react";
import {MyContext} from "../../app/App";
import axios from "axios";

const VisaPayment = () => {
    let value = useContext(MyContext);
    const [MainList, setMainList] = useState([]);
    const [getSearchText, setGetSearchText] = useState("");
    const [viewDoc, setViewDoc] = useState(false);
    const [docUrl, setDocUrl] = useState("");

    useEffect(() => {
        axios.get(`${value.url}dashboard/visapayment/`, {
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

    return <div className="payment-container">
        <div className="search-box">
            <div className="inputs">
                <input onChange={(e) => {
                    setGetSearchText(e.target.value)
                }} placeholder="Izlash" type="text"/>
                <div className="serach-btn"><img src="../images/admin/search.png" alt=""/></div>
            </div>
        </div>

        <div className="table-content">
            <table>
                <thead>
                <tr>
                    <th>№</th>
                    <th>Chek</th>
                    <th>Balans</th>
                    <th>Telefon raqam</th>
                </tr>
                </thead>

                <tbody>
                {MainList.filter((item) => {
                    return getSearchText.toLowerCase() === ""
                        ? item
                        : item.user.toString().toLowerCase().includes(getSearchText);
                }).map((item, index) => {
                        return <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                                {item.bill ?
                                    <img onClick={() => {
                                        setDocUrl(item.bill)
                                        setViewDoc(true)
                                    }} src="../images/admin/ticket.png" alt=""/> : ""}
                            </td>
                            <td>{item.user}</td>
                            <td>{item.phone}</td>
                        </tr>
                    })
                }
                </tbody>
            </table>
        </div>

        <div className={`view-docs ${!viewDoc ? "hide" : ""}`}>
            <div className="for-image">
                <div className="cancel-btn">
                    <div></div>
                    <img onClick={() => setViewDoc(false)} src="../images/admin/close.png" alt=""/>
                </div>
                <div className="for-img">
                    <img src={docUrl} alt=""/>
                </div>
            </div>
        </div>
    </div>
};

export default VisaPayment