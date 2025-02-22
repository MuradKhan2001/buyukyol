import "./Prices.scss";
import {useContext, useEffect, useState} from "react";
import {MyContext} from "../../app/App";
import axios from "axios";


const Prices = () => {
    let value = useContext(MyContext);
    const [MainList, setMainList] = useState([]);
    const [editCar, setEditCar] = useState(false);
    const [carId, setCarId] = useState(false);
    const [price, setPrice] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [regions, setRegions] = useState([]);

    const getList = () => {
        axios.get(`${value.url}dashboard/routes/`, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then((response) => {
            setMainList(response.data)
            console.log(response.data);
        }).catch((error) => {
            if (error.response.statusText == "Unauthorized") {
                window.location.pathname = "/";
                localStorage.removeItem("token");
            }
        });

        axios.get(`${value.url}dashboard/region/`, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then((response) => {
            setRegions(response.data)
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
        if (address1.trim().length > 0 && address2.trim().length > 0 && price.trim().length > 0) {
            axios.post(`${value.url}dashboard/routes/`, {from_region: address1, to_region: address2, cost: price}, {
                headers: {
                    "Authorization": `Token ${localStorage.getItem("token")}`
                }
            }).then((response) => {
                getList();
                setAddress1("");
                setAddress2("");
                setPrice("")
            })
        } else alert("Formani toldiring")
    };

    const EditCars = (ind) => {
        setEditCar(true);
        let address1 = MainList[ind].from_region.id;
        let address2 = MainList[ind].to_region.id;
        let price = MainList[ind].cost;
        setAddress1(address1);
        setAddress2(address2);
        setPrice(price);
    };

    const EditCars2 = () => {
        setEditCar(false);

        axios.patch(`${value.url}dashboard/routes/${carId}/`, {from_region: address1, to_region: address2, cost: price}, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then(() => {
            getList();
            setAddress1("");
            setAddress2("");
            setPrice("");
        })
    };

    const EditCars3 = () => {
        setEditCar(false);
        setAddress1("");
        setAddress2("");
        setPrice("")
    };

    const DelCar = (id) => {
        axios.delete(`${value.url}dashboard/routes/${id}/`, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then(() => {
            getList();
        })
    };

    return <div className="direction-container">
        <div className="header-side">
            <div className="filter-box">
                <div className="inputs">
                    <div className="form">
                        <label htmlFor="address1">1-Manzil</label>
                        <select
                            id="address1"
                            value={address1}
                            onChange={(e) => setAddress1(e.target.value)}
                            name="address1">
                            <option></option>
                            {
                                regions.map((item, index) => {
                                    return <option value={item.id} key={index}>
                                        {item.region}
                                    </option>
                                })}
                        </select>
                    </div>

                    <div className="form">
                        <label htmlFor="address2">2-Manzil</label>

                        <select
                            id="address2"
                            value={address2}
                            onChange={(e) => setAddress2(e.target.value)}
                            name="address2">
                            <option></option>
                            {
                                regions.map((item, index) => {
                                    return <option value={item.id} key={index}>
                                        {item.region}
                                    </option>
                                })}
                        </select>
                    </div>

                    <div className="form">
                        <label htmlFor="price">Narx</label>
                        <input value={price} name="price" id="price" onChange={(e) => setPrice(e.target.value)}
                               placeholder="Narxni kiriting" type="text"/>
                    </div>
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
                    <th>1-manzil</th>
                    <th>2-manzil</th>
                    <th>Narx</th>
                    <th>Tahrirlash</th>
                    <th>O'chirish</th>
                </tr>
                </thead>

                <tbody>
                {
                    MainList.map((item, index) => {
                        return <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.from_region.region}</td>
                            <td>{item.to_region.region}</td>
                            <td>
                                {item.cost}
                            </td>
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

export default Prices