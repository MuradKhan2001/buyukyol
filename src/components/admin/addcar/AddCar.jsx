import "./addcar.scss";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {MyContext} from "../../app/App";


const AddCar = () => {
    let value = useContext(MyContext);
    const [viewDoc, setViewDoc] = useState(false);
    const [docUrl, setDocUrl] = useState("");
    const [MainList, setMainList] = useState([]);
    const [editCar, setEditCar] = useState(false);
    const [carId, setCarId] = useState("");
    const [Car, setCar] = useState({
        name: "",
        image: null,
        min_weight: "",
        max_weight: ""
    });

    const getInputs = (e) => {
        Car[e.target.name] = e.target.value;
    };

    function getImage(e) {
        Car[e.target.name] = e.target.files[0]
    }

    const getList = () => {
        axios.get(`${value.url}api/car-category/`, {
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
        if (Car.name.trim().length > 0 && Car.min_weight.trim().length > 0 && Car.max_weight.trim().length > 0
            && Car.image) {

            let Post = new FormData();

            for (let key in Car) {
                Post.append(key, Car[key])
            }

            axios.post(`${value.url}api/car-category/`, Post, {
                headers: {
                    "Authorization": `Token ${localStorage.getItem("token")}`
                }
            }).then(() => {
                getList();
                let newList = {
                    name: "",
                    image: null,
                    min_weight: "",
                    max_weight: ""
                };
                setCar(newList);

                document.getElementById('name').value = "";
                document.getElementById('image').value = "";
                document.getElementById('min_weight').value = "";
                document.getElementById('max_weight').value = ""
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

        let newList = {
            name: MainList[ind].name,
            min_weight: MainList[ind].min_weight,
            max_weight: MainList[ind].max_weight
        };
        setCar(newList);

        document.getElementById('name').value = MainList[ind].name;
        document.getElementById('min_weight').value = MainList[ind].min_weight;
        document.getElementById('max_weight').value = MainList[ind].max_weight
    };

    const EditCars2 = () => {
        setEditCar(false);
        let Post = new FormData();

        for (let key in Car) {
            Post.append(key, Car[key])
        }

        axios.patch(`${value.url}api/car-category/${carId}/`, Post, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then(() => {
            getList();
            let newList = {
                name: "",
                image: null,
                min_weight: "",
                max_weight: ""
            };
            setCar(newList);

            document.getElementById('name').value = "";
            document.getElementById('image').value = "";
            document.getElementById('min_weight').value = "";
            document.getElementById('max_weight').value = ""
        }).catch(() => {

        });
    };

    const EditCars3 = () => {
        setEditCar(false);

        let newList = {
            name: "",
            image: null,
            min_weight: "",
            max_weight: ""
        };
        setCar(newList);

        document.getElementById('name').value = "";
        document.getElementById('image').value = "";
        document.getElementById('min_weight').value = "";
        document.getElementById('max_weight').value = ""
    };

    const DelCar = (id) => {
        axios.delete(`${value.url}api/car-category/${id}/`, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then(() => {
            getList();
        }).catch(() => {
        });
    };


    return <div className="car-container">
        <div className="header-side">
            <div className="filter-box">
                <div className="inputs">
                    <input onChange={getInputs} name="name" id="name" placeholder="Tarif nomi" type="text"/>

                    <div className="get-image">
                        <label htmlFor="image">Moshina rasmi:</label>
                        <input onChange={getImage} name="image" id="image" placeholder="Yuk hajmi" type="file"/>
                    </div>

                    <input onChange={getInputs} name="min_weight" id="min_weight" placeholder="Yuk vazni min"
                           type="text"/>
                    <input onChange={getInputs} name="max_weight" id="max_weight" placeholder="Yuk vazni max"
                           type="text"/>
                </div>

                {
                    editCar ? <div className="btns">
                            <div onClick={EditCars2} className="filter-btn">
                                <span>Tahrirlash</span>
                                <img src="../images/admin/add-package.png" alt=""/>
                            </div>
                            <div onClick={EditCars3} className="xbtn">
                                <img src="../images/admin/close2.png" alt=""/>
                            </div>
                        </div> :
                        <div onClick={AddCars} className="filter-btn">
                            <span>Qo'shish</span>
                            <img src="../images/admin/add-package.png" alt=""/>
                        </div>
                }
            </div>
        </div>

        <div className="table-content">
            <table>
                <thead>
                <tr>
                    <th>№</th>
                    <th>Tarif nomi</th>
                    <th>Rasmi</th>
                    <th>Yuk vazni min</th>
                    <th>Yuk vazni max</th>
                    <th>Tahrirlash</th>
                    <th>O'chirish</th>
                </tr>
                </thead>
                <tbody>
                {
                    MainList.map((item, index) => {
                        return <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.name}</td>
                            <td>
                                {item.image ?
                                    <img onClick={() => {
                                        setDocUrl(item.image)
                                        setViewDoc(true)
                                    }} src="../images/admin/photo.png" alt=""/> : ""}
                            </td>
                            <td>{item.min_weight}</td>
                            <td>{item.max_weight}</td>
                            <td>
                                <div>
                                    <img onClick={() => {
                                        EditCars(index);
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

export default AddCar