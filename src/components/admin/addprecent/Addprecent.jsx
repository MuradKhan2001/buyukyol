import "./style.scss";
import axios from "axios";
import {useContext, useEffect, useState} from "react";
import {MyContext} from "../../app/App";

const Addprecent  = () =>{
    let value = useContext(MyContext);
    const [MainList, setMainList] = useState([]);
    const [editCar, setEditCar] = useState(false);
    const [carId, setCarId] = useState(false);
    const [name, setName] = useState("");


    const getList = () => {
        axios.get(`${value.url}dashboard/chargerate/`, {
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

        if (name.trim().length > 0 ) {

            axios.post(`${value.url}dashboard/chargerate/`,{rate: name}, {
                headers: {
                    "Authorization": `Token ${localStorage.getItem("token")}`
                }
            }).then(() => {
                getList();
                setName("");
                document.getElementById('name').value = ""
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
        let newName = MainList[ind].rate;
        setName(newName);
        document.getElementById('name').value = MainList[ind].rate
    };

    const EditCars2 = () => {
        setEditCar(false);

        axios.patch(`${value.url}dashboard/chargerate/${carId}/`, {rate:name}, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then(() => {
            getList();

            setName("");

            document.getElementById('name').value = ""

        }).catch((error) => {
            if (error.response.statusText == "Unauthorized") {
                window.location.pathname = "/";
                localStorage.removeItem("token");
            }
        });
    };

    const EditCars3 = () => {
        setEditCar(false);
        setName("");
        document.getElementById('name').value = ""
    };

    const DelCar = (id) => {
        axios.delete(`${value.url}dashboard/chargerate/${id}/`, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then(() => {
            getList();
        }).catch(() => {
        });
    };


    return <div className="precent-container">
        <div className="header-side">
            <div className="filter-box">
                <div className="inputs">
                    <input name="name" id="name" onChange={(e)=>setName(e.target.value)}  placeholder="Foiz" type="text"/>
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
                    <th>Foiz</th>
                    <th>Tahrirlash</th>
                    <th>O'chirish</th>
                </tr>
                </thead>

                <tbody>
                {
                    MainList.map((item, index) => {
                        return <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.rate}</td>
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

export default Addprecent