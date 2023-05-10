import "./partners.scss"
import axios from "axios";
import {useContext, useEffect, useState} from "react";
import {MyContext} from "../../app/App";

const Partners = () => {
    let value = useContext(MyContext);
    const [MainList, setMainList] = useState([]);
    const [addPrice, setAddPrice] = useState({
        partner: "",
        amount: ""
    });

    const getInputs = (e) => {
        addPrice[e.target.name] = e.target.value;
    };

    const getList = () => {

        axios.get(`${value.url}dashboard/partner/`, {
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
        getList();
    }, []);

    const AddCars = () => {
        if (addPrice.amount.trim().length > 0 && addPrice.partner.trim().length > 0) {

            axios.post(`${value.url}dashboard/partner-payment/`, addPrice, {
                headers: {
                    "Authorization": `Token ${localStorage.getItem("token")}`
                }
            }).then((response) => {
                getList();
                let newList = {
                    partner: "",
                    amount: ""
                };
                setAddPrice(newList);
                document.getElementById('partner').value = "";
                document.getElementById('amount').value = "";

            }).catch((error) => {
                if (error.response.statusText == "Unauthorized") {
                    window.location.pathname = "/";
                    localStorage.removeItem("token");
                }
            });
        } else alert("Formani toldiring")
    };

    return <div className="partners-container">

        <div className="header-side">
            <div className="filter-box">
                <div className="inputs">
                    <select onChange={getInputs} name="partner" id="partner">
                        <option></option>
                        {
                            MainList.map((item, index) => {
                                return <option key={index} value={item.id}>{item.name}</option>
                            })
                        }
                    </select>

                    <input onChange={getInputs} name="amount" id="amount" placeholder="Narx" type="number"/>

                </div>

                <div onClick={AddCars} className="filter-btn">
                    <span>Qo'shish</span>
                </div>
            </div>
        </div>


        <div className="table-content">
            <table>
                <thead>
                <tr>
                    <th>№</th>
                    <th>Nomi</th>
                    <th>Logo</th>
                    <th>Shartnoma</th>
                    <th>Sana</th>
                    <th>Oxirgi to'lov</th>
                    <th>Umumiy to'lov</th>
                </tr>
                </thead>

                <tbody>
                {
                    MainList.map((item, index) => {
                        return <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.name}</td>
                            <td>
                                <div>
                                    <img src={item.logo} alt=""/>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <a href={item.contract} target="_blank">
                                        <img  src="../images/admin/download.png" alt=""/>
                                    </a>
                                </div>
                            </td>
                            <td>{item.date}</td>
                            <td>{item.last_payment}</td>
                            <td>{item.tottal_amount}</td>
                        </tr>
                    })
                }
                </tbody>
            </table>
        </div>
    </div>
};

export default Partners