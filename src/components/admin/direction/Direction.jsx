import "./direction.scss";
import {useContext, useEffect, useState} from "react";
import {MyContext} from "../../app/App";
import axios from "axios";


const Direction = () => {
    let value = useContext(MyContext);
    const [MainList, setMainList] = useState([]);
    const [editCar, setEditCar] = useState(false);
    const [carId, setCarId] = useState(false);
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");



    const getList = () => {
        axios.get(`${value.url}dashboard/routes/`, {
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
        if (address1.trim().length > 0 && address2.trim().length > 0) {

            axios.post(`${value.url}dashboard/routes/`,{address1, address2}, {
                headers: {
                    "Authorization": `Token ${localStorage.getItem("token")}`
                }
            }).then((response) => {
                getList();
                setAddress1("");
                setAddress2("");
                document.getElementById('address1').value = ""
                document.getElementById('address2').value = ""

            }).catch(() => {
            });
        } else alert("Formani toldiring")
    };

    const EditCars = (ind) => {
        setEditCar(true);
        let address1 = MainList[ind].address1;
        let address2 = MainList[ind].address2;
        setAddress1(address1);
        setAddress2(address2);
        document.getElementById('address1').value = MainList[ind].address1
        document.getElementById('address2').value = MainList[ind].address2
    };

    const EditCars2 = () => {
        setEditCar(false);

        axios.patch(`${value.url}dashboard/routes/${carId}/`, {address1, address2}, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then(() => {
            getList();

            setAddress1("");
            setAddress2("");

            document.getElementById('address1').value = ""
            document.getElementById('address2').value = ""

        }).catch(() => {

        });
    };

    const EditCars3 = () => {
        setEditCar(false);
        setAddress1("");
        setAddress2("");
        document.getElementById('address1').value = ""
        document.getElementById('address2').value = ""
    };

    const DelCar = (id) => {
        axios.delete(`${value.url}dashboard/routes/${id}/`, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then(() => {
            getList();
        }).catch(() => {
        });
    };


    return <div className="direction-container">
        <div className="header-side">
            <div className="filter-box">
                <div className="inputs">
                    <input name="address1" id="address1" onChange={(e)=>setAddress1(e.target.value)}  placeholder="Qayerdan" type="text"/>
                    <input name="address2" id="address2" onChange={(e)=>setAddress2(e.target.value)}  placeholder="Qayerga" type="text"/>
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
                    <th>Qayerdan</th>
                    <th>Qayerga</th>
                    <th>Tasdiqlash </th>
                    <th>Tahrirlash</th>
                    <th>O'chirish</th>
                </tr>
                </thead>

                <tbody>
                {
                    MainList.map((item, index) => {
                        return <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.address1}</td>
                            <td>{item.address2}</td>
                            <td>
                                <div>
                                    {item.is_rush ? <img onClick={() => {
                                            axios.post(`${value.url}dashboard/routes/${item.id}/rush/`, {}, {
                                                headers: {
                                                    "Authorization": `Token ${localStorage.getItem("token")}`
                                                }
                                            }).then(() => {
                                                getList()
                                            }).catch(() => {

                                            });
                                        }} src={`../images/admin/verified.png`} alt=""/> :

                                        <img onClick={() => {
                                            axios.post(`${value.url}dashboard/routes/${item.id}/rush/`, {}, {
                                                headers: {
                                                    "Authorization": `Token ${localStorage.getItem("token")}`
                                                }
                                            }).then(() => {
                                                getList()
                                            }).catch(() => {
                                            });
                                        }} src={`../images/admin/verified1.png`} alt=""/>}
                                </div>
                            </td>
                            <td>
                                <div>
                                    <img onClick={()=>{
                                        EditCars(index)
                                        setCarId(item.id)
                                    }} src="../images/admin/edit.png" alt=""/>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <img onClick={()=>DelCar(item.id)} src="../images/admin/delete.png" alt=""/>
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

export default Direction