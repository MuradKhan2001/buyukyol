import "./payment.scss";
import {useContext, useEffect, useState} from "react";
import {MyContext} from "../../app/App";
import axios from "axios";

const Payment = () => {
    let value = useContext(MyContext);
    const [MainList, setMainList] = useState([]);
    const [getSearchText, setGetSearchText] = useState("");
    const [id, setId] = useState("");
    const [price, setPrice] = useState("");

    useEffect(() => {
        axios.get(`${value.url}dashboard/cashpayment/`, {
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

    const addCash = () => {

        let newCash = {
            amount: price,
            balance: id
        };

        axios.post(`${value.url}dashboard/cashpayment/`, newCash, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then((response) => {

            axios.get(`${value.url}dashboard/cashpayment/`, {
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

            setId("");
            setPrice("");

            document.getElementById('id').value ="";
            document.getElementById('price').value ="";

        }).catch((error) => {
            if (error.response.status == 404) alert("Ushbu balans topilmadi!")
        });

    };

    return <div className="payment-container">
        <div className="header-side">
            <div className="filter-box">
                <div className="inputs">
                    <input id="id" onChange={(e) => setId(e.target.value)} placeholder="id" type="number" />
                    <input id="price" onChange={(e) => setPrice(e.target.value)} placeholder="narx" type="text"/>
                </div>

                <div onClick={addCash} className="filter-btn">
                    <span>To'lash</span>
                    <img src="../images/admin/wallet.png" alt=""/>
                </div>
            </div>
        </div>

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
                    <th>id</th>
                    <th>Narx</th>
                    <th>Sana</th>
                </tr>
                </thead>

                <tbody>
                {MainList.filter((item) => {
                    return getSearchText.toLowerCase() === ""
                        ? item
                        : item.balance.toString().toLowerCase().includes(getSearchText);
                }).map((item, index) => {
                        return <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.balance}</td>
                            <td>{item.amount}</td>
                            <td>{item.created_at}</td>
                        </tr>
                    })
                }
                </tbody>
            </table>
        </div>
    </div>
};

export default Payment