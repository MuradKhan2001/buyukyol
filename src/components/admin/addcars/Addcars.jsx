import "./style.scss";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {MyContext} from "../../app/App";


const AddCars = () => {
    let value = useContext(MyContext);
    const [viewDoc, setViewDoc] = useState(false);
    const [docUrl, setDocUrl] = useState("");
    const [MainList, setMainList] = useState([]);
    const [editCar, setEditCar] = useState(false);
    const [carId, setCarId] = useState("");
    const [Car, setCar] = useState({
        category: "",
        name: "",
        name_en: "",
        name_ru: "",
        height: "",
        widht: "",
        breadth: "",
        car_image: null,
        cargo_volume: "",
        cargo_weight: ""
    });
    const [category, setCategory] = useState([]);

    const getInputs = (e) => {
        Car[e.target.name] = e.target.value;
    };

    function getImage(e) {
        Car[e.target.name] = e.target.files[0]
    }

    const getList = () => {
        axios.get(`${value.url}api/car/`, {
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

        axios.get(`${value.url}api/car-category/`, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then((response) => {
            setCategory(response.data)
        }).catch(() => {
        });
    }, []);

    const AddCars = () => {
        if (Car.category.trim().length > 0 && Car.name.trim().length && Car.name_ru.trim().length && Car.height.trim().length && Car.widht.trim().length
            && Car.breadth.trim().length && Car.cargo_volume.trim().length 
            && Car.cargo_weight.trim().length && Car.car_image && Car.name_en.trim().length > 0 )  {

            let Post = new FormData();

            for (let key in Car) {
                Post.append(key, Car[key])
            }

            axios.post(`${value.url}api/car/`, Post, {
                headers: {
                    "Authorization": `Token ${localStorage.getItem("token")}`
                }
            }).then(() => {
                getList();
                let newList = {
                    category: "",
                    name: "",
                    name_en: "",
                    name_ru: "",
                    height: "",
                    widht: "",
                    breadth: "",
                    car_image: null,
                    cargo_volume: "",
                    cargo_weight: ""
                };
                setCar(newList);

                document.getElementById('category').value = "";
                document.getElementById('name').value = "";
                document.getElementById('name_en').value = "";
                document.getElementById('name_ru').value = "";
                document.getElementById('height').value = "";
                document.getElementById('widht').value = "";
                document.getElementById('breadth').value = "";
                document.getElementById('car_image').value = "";
                document.getElementById('cargo_volume').value = "";
                document.getElementById('cargo_weight').value = "";
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
            category: MainList[ind].category,
            name: MainList[ind].name,
            name_en: MainList[ind].name_en,
            name_ru: MainList[ind].name_ru,
            height: MainList[ind].height,
            widht: MainList[ind].widht,
            breadth: MainList[ind].breadth,
            cargo_volume: MainList[ind].cargo_volume,
            cargo_weight: MainList[ind].cargo_weight
        };
        setCar(newList);

        document.getElementById('category').value = MainList[ind].category;
        document.getElementById('name').value = MainList[ind].name;
        document.getElementById('name_en').value = MainList[ind].name_en;
        document.getElementById('name_ru').value = MainList[ind].name_ru;
        document.getElementById('height').value = MainList[ind].height;
        document.getElementById('widht').value = MainList[ind].widht;
        document.getElementById('breadth').value = MainList[ind].breadth;
        document.getElementById('cargo_volume').value = MainList[ind].cargo_volume;
        document.getElementById('cargo_weight').value = MainList[ind].cargo_weight
    };

    const EditCars2 = () => {

        let Post = new FormData();
        for (let key in Car) {
            Post.append(key, Car[key])
        }

        axios.patch(`${value.url}api/car/${carId}/`, Post, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then(() => {
            setEditCar(false);
            getList();

            let newList = {
                category: "",
                name: "",
                name_en: "",
                name_ru: "",
                height: "",
                widht: "",
                breadth: "",
                car_image: null,
                cargo_volume: "",
                cargo_weight: ""
            };
            setCar(newList);

            document.getElementById('category').value = "";
            document.getElementById('name').value = "";
            document.getElementById('name_en').value = "";
            document.getElementById('name_ru').value = "";
            document.getElementById('height').value = "";
            document.getElementById('widht').value = "";
            document.getElementById('breadth').value = "";
            document.getElementById('car_image').value = "";
            document.getElementById('cargo_volume').value = "";
            document.getElementById('cargo_weight').value = "";

        }).catch(() => {

        });
    };

    const EditCars3 = () => {
        setEditCar(false);

        let newList = {
            category: "",
            name: "",
            name_en: "",
            name_ru: "",
            height: "",
            widht: "",
            breadth: "",
            car_image: null,
            cargo_volume: "",
            cargo_weight: ""
        };
        setCar(newList);

        document.getElementById('category').value = "";
        document.getElementById('name').value = "";
        document.getElementById('name_en').value = "";
        document.getElementById('name_ru').value = "";
        document.getElementById('height').value = "";
        document.getElementById('widht').value = "";
        document.getElementById('breadth').value = "";
        document.getElementById('car_image').value = "";
        document.getElementById('cargo_volume').value = "";
        document.getElementById('cargo_weight').value = "";
    };

    const DelCar = (id) => {
        axios.delete(`${value.url}api/car/${id}/`, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then(() => {
            getList();
        }).catch(() => {
        });
    };


    return <div className="cars-container">
        <div className="header-side">
            <div className="filter-box">
                <div className="inputs">
                    <select onChange={getInputs} name="category" id="category">
                        <option></option>
                        {
                            category.map((item, index) => {
                                return <option value={item.id} key={index}>
                                    {localStorage.getItem("lng") === "uz" ? item.name : item.name_ru} &nbsp; &nbsp;
                                    {item.min_weight} &nbsp; - &nbsp;
                                    {item.max_weight}
                                </option>
                            })
                        }
                    </select>

                    <input onChange={getInputs} name="name" id="name" placeholder="Moshina nomi" type="text"/>
                    <input onChange={getInputs} name="name_ru" id="name_ru" placeholder="Название автомобиля" type="text"/>
                    <input onChange={getInputs} name="name_en" id="name_en" placeholder="Name car" type="text"/>
                    <input onChange={getInputs} name="height" id="height" placeholder="Balandligi" type="text"/>
                    <input onChange={getInputs} name="widht" id="widht" placeholder="Uzunligi" type="text"/>
                    <input onChange={getInputs} name="breadth" id="breadth" placeholder="Kengligi" type="text"/>

                    <div className="get-image">
                        <label htmlFor="car_image">Moshina rasmi:</label>
                        <input onChange={getImage} name="car_image" id="car_image" placeholder="Yuk hajmi" type="file"/>
                    </div>

                    <input onChange={getInputs} name="cargo_volume" id="cargo_volume" placeholder="Kub"
                           type="text"/>

                    <input onChange={getInputs} name="cargo_weight" id="cargo_weight" placeholder="Yuk olishi"
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
                    <th>Kategoriya</th>
                    <th>Moshina nomi</th>
                    <th>Balandligi</th>
                    <th>Uzunligi</th>
                    <th>Kengligi</th>
                    <th>Rasmi</th>
                    <th>Kub</th>
                    <th>Qancha yuk olishi</th>
                    <th>Tahrirlash</th>
                    <th>O'chirish</th>
                </tr>
                </thead>
                <tbody>
                {
                    MainList.map((item, index) => {
                        return <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                                {
                                category.map((items)=>{
                                    if (items.id === item.category) return items.name
                                })}
                            </td>
                            <td> {localStorage.getItem("lng") === "uz" ? item.name : item.name_ru}</td>
                            <td>{item.height}</td>
                            <td>{item.widht}</td>
                            <td>{item.breadth}</td>
                            <td>
                                {item.car_image ?
                                    <img onClick={() => {
                                        setDocUrl(item.car_image)
                                        setViewDoc(true)
                                    }} src="../images/admin/photo.png" alt=""/> : ""}
                            </td>
                            <td>{item.cargo_volume}</td>
                            <td>{item.cargo_weight}</td>
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

export default AddCars