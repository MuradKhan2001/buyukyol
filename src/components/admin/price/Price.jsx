import "./price.scss";
import {useContext, useEffect, useState} from "react";
import {MyContext} from "../../app/App";
import axios from "axios";


const Price = () => {
    let value = useContext(MyContext);
    const [MainList, setMainList] = useState([]);
    const [editCar, setEditCar] = useState(false);
    const [carId, setCarId] = useState(false);
    const [min_weight, setMin_weight] = useState("");
    const [max_weight, setMax_weight] = useState("");
    const [car_count, setCar_count] = useState("");
    const [price, setPrice] = useState("");
    const [over_weight_cost, setOver_weight_cost] = useState("");


    const getList = () => {
        axios.get(`${value.url}dashboard/priceoptions/`, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then((response) => {
            setMainList(response.data)
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

    const AddCars = () => {

        if (min_weight.trim().length > 0 && max_weight.trim().length > 0 && price.trim().length > 0 &&
            over_weight_cost.trim().length > 0 && car_count.trim().length > 0) {

            axios.post(`${value.url}dashboard/priceoptions/`, {min_weight, max_weight, price, over_weight_cost, car_count}, {
                headers: {
                    "Authorization": `Token ${localStorage.getItem("token")}`
                }
            }).then(() => {
                getList();
                setMin_weight("");
                setMax_weight("");
                setPrice("");
                setCar_count("");
                setOver_weight_cost("");

                document.getElementById('min_weight').value = "";
                document.getElementById('max_weight').value = "";
                document.getElementById('price').value = "";
                document.getElementById('car_count').value = "";
                document.getElementById('over_weight_cost').value = ""

            }).catch((error) => {
                if (error.response.statusText == "Unauthorized") {
                    window.location.pathname = "/";
                    localStorage.removeItem("token");
                }
            });
        } else alert("Formani toldiring")

    };

    const EditCars = (ind) => {
        setEditCar(true);
        let min_weight = MainList[ind].min_weight;
        let max_weight = MainList[ind].max_weight;
        let price = MainList[ind].price;
        let car_count = MainList[ind].car_count;
        let over_weight_cost = MainList[ind].over_weight_cost;

        setMin_weight(min_weight);
        setMax_weight(max_weight);
        setPrice(price);
        setCar_count(car_count);
        setOver_weight_cost(over_weight_cost);

        document.getElementById('min_weight').value = min_weight;
        document.getElementById('max_weight').value = max_weight;
        document.getElementById('price').value = price;
        document.getElementById('car_count').value = car_count;
        document.getElementById('over_weight_cost').value = over_weight_cost
    };

    const EditCars2 = () => {
        setEditCar(false);

        axios.patch(`${value.url}dashboard/priceoptions/${carId}/`, {min_weight, max_weight, price, over_weight_cost,car_count}, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then((response) => {
            getList();

            setMin_weight("");
            setMax_weight("");
            setPrice("");
            setCar_count("");
            setOver_weight_cost("");

            document.getElementById('min_weight').value = "";
            document.getElementById('max_weight').value = "";
            document.getElementById('price').value = "";
            document.getElementById('car_count').value = "";
            document.getElementById('over_weight_cost').value = ""

        }).catch((error) => {
            if (error.response.statusText == "Unauthorized") {
                window.location.pathname = "/";
                localStorage.removeItem("token");
            }
        });
    };

    const EditCars3 = () => {
        setEditCar(false);

        setMin_weight("");
        setMax_weight("");
        setPrice("");
        setCar_count("");
        setOver_weight_cost("");

        document.getElementById('min_weight').value = "";
        document.getElementById('max_weight').value = "";
        document.getElementById('price').value = "";
        document.getElementById('car_count').value = "";
        document.getElementById('over_weight_cost').value = ""
    };

    const DelCar = (id) => {
        axios.delete(`${value.url}dashboard/priceoptions/${id}/`, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then(() => {
            getList();
        }).catch(() => {
        });
    };


    return <div className="price-container">
        <div className="header-side">
            <div className="filter-box">
                <div className="inputs">
                    <input name="min_weight" id="min_weight" onChange={(e) => setMin_weight(e.target.value)} placeholder="Min vazn"
                           type="text"/>
                    <input name="max_weight" id="max_weight" onChange={(e) => setMax_weight(e.target.value)} placeholder="Max vazn"
                           type="text"/>
                    <input name="price" id="price" onChange={(e) => setPrice(e.target.value)} placeholder="Narx"
                           type="text"/>
                    <input name="over_weight_cost" id="over_weight_cost" onChange={(e) => setOver_weight_cost(e.target.value)}
                           placeholder="Ortiqcha vazn uchun narx" type="text"/>

                    <input name="car_count" id="car_count" onChange={(e) => setCar_count(e.target.value)} placeholder="Moshinalar soni"
                           type="text"/>
                </div>

                {
                    editCar ? <div className="btns">
                            <div onClick={EditCars2} className="filter-btn">
                                <span>Tahrirlash</span>
                            </div>
                            <div onClick={EditCars3} className="xbtn">
                                <img src="../images/admin/close2.png" alt=""/>
                            </div>
                        </div> :
                        <div onClick={AddCars} className="filter-btn">
                            <span>Qo'shish</span>
                        </div>
                }
            </div>
        </div>

        <div className="table-content">
            <table>
                <thead>
                <tr>
                    <th>№</th>
                    <th>Min Vazn</th>
                    <th>Max vazn</th>
                    <th>Narx</th>
                    <th>Ortiqcha vazn uchun narx</th>
                    <th>Moshinalar soni</th>
                    <th>Tahrirlash</th>
                    <th>O'chirish</th>
                </tr>
                </thead>

                <tbody>
                {
                    MainList.map((item, index) => {
                        return <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.min_weight}</td>
                            <td>{item.max_weight}</td>
                            <td>{item.price}</td>
                            <td>{item.over_weight_cost}</td>
                            <td>{item.car_count}</td>
                            <td>
                                <div>
                                    <img onClick={() => {
                                        EditCars(index)
                                        setCarId(item.id)
                                    }} src="../images/admin/edit.png" alt=""/>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <img onClick={() => DelCar(item.id)} src="../images/admin/delete.png" alt=""/>
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

export default Price