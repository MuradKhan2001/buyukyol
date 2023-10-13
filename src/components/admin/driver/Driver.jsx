import "./driver.scss";
import Modal from 'react-bootstrap/Modal';
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {MyContext} from "../../app/App";
import {saveAs} from "file-saver";

const Driver = () => {
    let value = useContext(MyContext);
    const [getSearchText, setGetSearchText] = useState("");
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [showEdit, setShowEdit] = useState(false);
    const [viewDoc, setViewDoc] = useState(false);
    const [docUrl, setDocUrl] = useState("");
    const [MainList, setMainList] = useState([]);
    const [links, setLinks] = useState({});
    const [Pages, setPages] = useState([]);
    const [activeItem, setActiveItem] = useState(1);
    const [carBodyList, setCarBodyList] = useState([]);
    const [category, setCategory] = useState([]);
    const [userId, setUserId] = useState("");
    const [country1, setCountry1] = useState(true);
    const [regions1, setRegions1] = useState(true);
    const [regions2, setRegions2] = useState(true);

    const [Driver, setDriver] = useState(
        {
            first_name: "",
            last_name: "",
            user_type: "Driver",
            phone: "",

            category_type: null,
            country1: null,
            address1: null,
            address2: null,

            category: "",
            car_number: "",
            name: "",
            widht: "",
            breadth: "",
            accept_of_terms: true,
            height: "",
            cargo_volume: "",
            cargo_weight: "",
            car_body: "",
            car_tex_passport: null,
            drivers_license_image: null,
            image: null,
            car_image: null
        });

    const direction = [
        {
            id: "IN",
            name: "Viloyat ichi",
        },
        {
            id: "OUT",
            name: "Viloyatlar aro",
        },
        {
            id: "Abroad",
            name: "Xalqaro",
        }
    ];

    const country = [
        {
            name: "All",
        },
        {
            name: "Albania",
        }, {
            name: "Andorra",
        }, {
            name: "Armenia",
        }, {
            name: "Austria",
        }, {
            name: "Azerbaijan",
        }, {
            name: "Belarus",
        }, {
            name: "Belgium",
        }, {
            name: "Bosnia and Herzegovina",
        }, {
            name: "Bulgaria",
        }, {
            name: "Croatia",
        }, {
            name: "Cyprus",
        }, {
            name: "Czech Republic",
        }, {
            name: "Denmark",
        }, {
            name: "Estonia",
        }, {
            name: "Finland",
        }, {
            name: "France",
        }, {
            name: "Georgia",
        }, {
            name: "Germany",
        }, {
            name: "Greece",
        }, {
            name: "Hungary",
        }, {
            name: "Iceland",
        }, {
            name: "Ireland",
        }, {
            name: "Italy",
        }, {
            name: "Kazakhstan",
        }, {
            name: "Kosovo",
        }, {
            name: "Latvia",
        }, {
            name: "Liechtenstein",
        }, {
            name: "Lithuania",
        }, {
            name: "Luxembourg",
        }, {
            name: "Malta",
        }, {
            name: "Moldova",
        }, {
            name: "Monaco",
        }, {
            name: "Montenegro",
        }, {
            name: "Netherlands",
        }, {
            name: "North Macedonia",
        }, {
            name: "Norway",
        }, {
            name: "Poland",
        }, {
            name: "Portugal",
        }, {
            name: "Romania",
        }, {
            name: "Russia",
        }, {
            name: "San Marino",
        }, {
            name: "Serbia",
        }, {
            name: "Slovakia",
        }, {
            name: "Slovenia",
        }, {
            name: "Spain",
        }, {
            name: "Sweden",
        }, {
            name: "Switzerland",
        }, {
            name: "Turkey",
        }, {
            name: "Ukraine",
        }, {
            name: "United Kingdom",
        }, {
            name: "Vatican City",
        }, {
            name: "Afghanistan",
        }, {
            name: "Bahrain",
        }, {
            name: "Bangladesh",
        }, {
            name: "Bhutan",
        }, {
            name: "Brunei",
        }, {
            name: "Cambodia",
        }, {
            name: "China",
        }, {
            name: "East Timor (Timor-Leste)",
        }, {
            name: "India",
        }, {
            name: "Indonesia",
        }, {
            name: "Iran",
        }, {
            name: "Iraq",
        }, {
            name: "Israel",
        }, {
            name: "Japan",
        }, {
            name: "Jordan",
        }, {
            name: "Kazakhstan",
        }, {
            name: "Kuwait",
        }, {
            name: "Kyrgyzstan",
        }, {
            name: "Laos",
        }, {
            name: "Lebanon",
        }, {
            name: "Malaysia",
        }, {
            name: "Maldives",
        }, {
            name: "Mongolia",
        }, {
            name: "Myanmar (Burma)",
        }, {
            name: "Nepal",
        }, {
            name: "North Korea",
        }, {
            name: "Oman",
        }, {
            name: "Pakistan",
        }, {
            name: "Palestine",
        }, {
            name: "Philippines",
        }, {
            name: "Qatar",
        }, {
            name: "Russia",
        }, {
            name: "Saudi Arabia",
        }, {
            name: "Singapore",
        }, {
            name: "South Korea",
        }, {
            name: "Sri Lanka",
        }, {
            name: "Syria",
        }, {
            name: "Taiwan",
        }, {
            name: "Tajikistan",
        }, {
            name: "Thailand",
        }, {
            name: "Turkey",
        }, {
            name: "Turkmenistan",
        }, {
            name: "United Arab Emirates",
        }, {
            name: "Uzbekistan",
        }, {
            name: "Vietnam",
        },
        {
            name: "Yemen",
        },
    ];

    const adress1 = [
        {
            name: "All",
        },
        {
            name: "Andijan",
        },
        {
            name: "Bukhara",
        },
        {
            name: "Djizzak",
        },
        {
            name: "Fergana",
        },
        {
            name: "Kashkadarya",
        },
        {
            name: "Khorezm",
        },
        {
            name: "Namangan",
        },
        {
            name: "Navoi",
        },
        {
            name: "Samarkand",
        },
        {
            name: "Surkhandarya",
        },
        {
            name: "Syrdarya",
        },
        {
            name: "Tashkent",
        },
        {
            name: "Republic of Karakalpakistan",
        },

    ];

    const adress2 = [
        {
            name: "All",
        },
        {
            name: "Andijan",
        },
        {
            name: "Bukhara",
        },
        {
            name: "Djizzak",
        },
        {
            name: "Fergana",
        },
        {
            name: "Kashkadarya",
        },
        {
            name: "Khorezm",
        },
        {
            name: "Namangan",
        },
        {
            name: "Navoi",
        },
        {
            name: "Samarkand",
        },
        {
            name: "Surkhandarya",
        },
        {
            name: "Syrdarya",
        },
        {
            name: "Tashkent",
        },
        {
            name: "Republic of Karakalpakistan",
        },

    ];

    const getInputs = (e) => {
        Driver[e.target.name] = e.target.value;

        if (Driver.category_type === "IN") {
            setRegions1(false);

            setCountry1(true)
            setRegions2(true)
        }

        if (Driver.category_type === "OUT") {
            setRegions1(false);
            setRegions2(false);

            setCountry1(true)
        }

        if (Driver.category_type === "Abroad") {
            setCountry1(false)

            setRegions1(true);
            setRegions2(true);
        }
    };

    function getImage(e) {
        Driver[e.target.name] = e.target.files[0]
    }

    const getList = (url = null) => {
        const main = url ? url : `${value.url}dashboard/drivers/`;
        axios.get(main, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then((response) => {
            setMainList(response.data.results);
            setLinks(response.data.links);
            setPages(response.data.links.pages)
        }).catch((error) => {
            if (error.response.statusText == "Unauthorized") {
                window.location.pathname = "/";
                localStorage.removeItem("token");
            }
        });
    };

    useEffect(() => {
        getList();

        axios.get(`${value.url}api/car/`).then((response) => {
            setCarBodyList(response.data)
        }).catch((error) => {

        });

        axios.get(`${value.url}api/car-category/`, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then((response) => {
            setCategory(response.data)
        }).catch(() => {
        });

    }, []);

    const addDriver = () => {
        if (Driver.first_name.trim().length > 0 && Driver.last_name.trim().length > 0 &&
            Driver.phone.trim().length > 0 && Driver.car_number.trim().length > 0 &&
            Driver.car_body.trim().length > 0 && Driver.widht.trim().length && Driver.breadth.trim().length
            && Driver.height.trim().length && Driver.cargo_volume.trim().length && Driver.cargo_weight.trim().length
            && Driver.car_tex_passport && Driver.car_image && Driver.image && Driver.drivers_license_image) {

            let Post = new FormData();

            for (let key in Driver) {
                Post.append(key, Driver[key])
            }

            axios.post(`${value.url}dashboard/drivers/`, Post, {
                headers: {
                    "Authorization": `Token ${localStorage.getItem("token")}`
                }
            }).then(() => {
                getList();
                let newList = {
                    first_name: "",
                    last_name: "",
                    user_type: "Driver",
                    phone: "",
                    category: "",
                    car_number: "",
                    name: "",
                    width: "",
                    breadth: "",
                    accept_of_terms: true,
                    height: "",
                    cargo_volume: "",
                    cargo_weight: "",
                    car_body: "",
                    car_tex_passport: null,
                    drivers_license_image: null,
                    image: null,
                    car_image: null,
                    category_type: null,
                    country1: null,
                    address1: null,
                    address2: null,
                };
                setDriver(newList);
                handleClose();
            }).catch((error) => {
                if (error.response.status == 400) alert("Bunday raqam ro'yxatdan o'tilgan")
            });

        } else alert("Formani to'ldiring")
    };

    const editDriver = (item) => {

        let newList = {
            first_name: item.first_name,
            last_name: item.last_name,
            phone: item.phone,
            category: item.documentation.category.id,
            car_number: item.documentation.car_number,
            name: item.documentation.name,
            widht: item.documentation.widht,
            breadth: item.documentation.breadth,
            height: item.documentation.height,
            cargo_volume: item.documentation.cargo_volume,
            cargo_weight: item.documentation.cargo_weight,
            car_body: item.documentation.car_body.id,

            category_type: item.documentation.category_type,
            country1: item.documentation.country1,
            address1: item.documentation.address1,
            address2: item.documentation.address2
        };
        setDriver(newList);

        document.getElementById('first_name').value = item.first_name;
        document.getElementById('last_name').value = item.last_name;
        document.getElementById('phone').value = item.phone;
        document.getElementById('category').value = item.documentation.category.id;
        document.getElementById('car_number').value = item.documentation.car_number;
        document.getElementById('name').value = item.documentation.name;
        document.getElementById('widht').value = item.documentation.widht;
        document.getElementById('breadth').value = item.documentation.breadth;
        document.getElementById('height').value = item.documentation.height;
        document.getElementById('cargo_volume').value = item.documentation.cargo_volume;
        document.getElementById('cargo_weight').value = item.documentation.cargo_weight;
        document.getElementById('car_body').value = item.documentation.car_body.id;

        document.getElementById('category_type').value = item.documentation.category_type;
        document.getElementById('country1').value = item.documentation.country1;
        document.getElementById('address1').value = item.documentation.address1;
        document.getElementById('address2').value = item.documentation.address2;
    };

    const editDriver2 = () => {
        let Post = new FormData();

        let user = userId;

        Post.append("user", user);
        for (let key in Driver) {
            Post.append(key, Driver[key])
        }

        axios.patch(`${value.url}dashboard/drivers/${userId}/`, Post, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then(() => {
            getList(Pages[activeItem - 1][activeItem])
            let newList = {
                first_name: "",
                last_name: "",
                user_type: "Driver",
                phone: "",
                category: "",
                car_number: "",
                name: "",
                width: "",
                breadth: "",
                accept_of_terms: true,
                height: "",
                cargo_volume: "",
                cargo_weight: "",
                car_body: "",
                car_tex_passport: null,
                drivers_license_image: null,
                image: null,
                car_image: null,
                category_type: null,
                country1: null,
                address1: null,
                address2: null,
            };
            setDriver(newList);
            setShowEdit(false);

            document.getElementById('first_name').value = "";
            document.getElementById('last_name').value = "";
            document.getElementById('phone').value = "";
            document.getElementById('category').value = "";
            document.getElementById('car_number').value = "";
            document.getElementById('name').value = "";
            document.getElementById('widht').value = "";
            document.getElementById('breadth').value = "";
            document.getElementById('height').value = "";
            document.getElementById('cargo_volume').value = "";
            document.getElementById('cargo_weight').value = "";
            document.getElementById('car_body').value = "";

            document.getElementById('category_type').value = "";
            document.getElementById('country1').value = "";
            document.getElementById('address1').value = "";
            document.getElementById('address2').value = "";
        }).catch(() => {

        });
    };

    const getDownloadFile = async () => {
        let format = docUrl.split(".");

        return axios.get(docUrl, {
            responseType: 'blob'
        }).then((response) => {
            saveAs(response.data, `photo.${format[format.length - 1]}`)
        })
    };

    return <div className="driver-container">

        <div className="search-box">
            <div className="inputs">
                <input onChange={(e) => setGetSearchText(e.target.value)} placeholder="Tel nomer orqali izlash..."
                       type="text"/>
                <div className="serach-btn"><img src="../images/admin/search.png" alt=""/></div>
            </div>

            <div onClick={() => {
                handleShow();
            }} className="add-driver">
                <img src="../images/admin/driver1.png" alt=""/>
                <img src="../images/admin/add1.png" alt=""/>
            </div>
        </div>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
                <div className="main-box">
                    <div className="main-sides">
                        <input onChange={getInputs} name="first_name" placeholder="Ism" type="text"/>
                        <input onChange={getInputs} name="phone" placeholder="Telefon raqam" type="text"/>
                        <input onChange={getInputs} name="name" placeholder="Moshina nomi" type="text"/>
                        <input onChange={getInputs} name="breadth" placeholder="Moshina kengligi" type="text"/>
                        <input onChange={getInputs} name="cargo_volume" placeholder="Kub" type="text"/>

                        <label >Yo'nalish turi:</label>
                        <select onChange={getInputs} name="category_type">
                            <option></option>
                            {
                                direction.map((item, index) => {
                                    return <option value={item.id} key={index}>
                                        {item.name}
                                    </option>
                                })
                            }
                        </select>

                        <label>1-viloyat:</label>
                        <select disabled={regions1} onChange={getInputs} name="address1">
                            <option></option>
                            {
                                adress1.map((item, index) => {
                                    return <option value={item.id} key={index}>
                                        {item.name}
                                    </option>
                                })
                            }
                        </select>

                        <label >Kategoriya</label>
                        <select onChange={getInputs} name="category">
                            <option></option>
                            {
                                category.map((item, index) => {
                                    return <option value={item.id} key={index}>
                                        {item.name} &nbsp; &nbsp;
                                        {item.min_weight} &nbsp; - &nbsp;
                                        {item.max_weight}
                                    </option>
                                })
                            }
                        </select>

                        <label >Haydovchi rasmi:</label>
                        <input onChange={getImage} name="image" type="file"/>

                        <label >Moshina rasmi</label>
                        <input onChange={getImage} name="car_image" type="file"/>

                    </div>
                    <div className="main-sides">
                        <input onChange={getInputs} name="last_name" placeholder="Familiya" type="text"/>
                        <input onChange={getInputs} name="car_number" placeholder="Moshina raqami" type="text"/>
                        <input onChange={getInputs} name="widht" placeholder="Uzunligi" type="text"/>
                        <input onChange={getInputs} name="height" placeholder="Moshina balandligi" type="text"/>
                        <input onChange={getInputs} name="cargo_weight" placeholder="Yuk vazni" type="text"/>

                        <label >Davlatlar:</label>
                        <select disabled={country1} onChange={getInputs} name="country1">
                            <option></option>
                            {
                                country.map((item, index) => {
                                    return <option value={item.name} key={index}>
                                        {item.name}
                                    </option>
                                })
                            }
                        </select>

                        <label >2- viloyat:</label>
                        <select disabled={regions2} onChange={getInputs} name="address2">
                            <option></option>
                            {
                                adress2.map((item, index) => {
                                    return <option value={item.id} key={index}>
                                        {item.name}
                                    </option>
                                })
                            }
                        </select>

                        <label >Kuzov turi:</label>
                        <select onChange={getInputs} name="car_body">
                            <option></option>
                            {carBodyList.map((item, index) => {
                                return <option value={item.id} key={index}>{item.name}</option>
                            })}

                        </select>

                        <label >Prava:</label>
                        <input onChange={getImage} name="drivers_license_image" type="file"/>

                        <label >Tex passport:</label>
                        <input onChange={getImage} name="car_tex_passport" type="file"/>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button onClick={addDriver}>
                    Qo'shish
                </button>
            </Modal.Footer>
        </Modal>

        <div className={`edit-box ${!showEdit ? "edit-box-hide" : ""}`}>
            <div className="title">Tahrirlash</div>

            <div className="main-box">
                <div className="main-sides">
                    <input id="first_name" onChange={getInputs} name="first_name" placeholder="Ism" type="text"/>
                    <input id="phone" onChange={getInputs} name="phone" placeholder="Telefon raqam" type="text"/>
                    <input id="name" onChange={getInputs} name="name" placeholder="Moshina nomi" type="text"/>
                    <input id="breadth" onChange={getInputs} name="breadth" placeholder="Moshina kengligi" type="text"/>
                    <input id="cargo_volume" onChange={getInputs} name="cargo_volume" placeholder="Kub" type="text"/>

                    <label >Yo'nalish turi:</label>
                    <select onChange={getInputs} id="category_type" name="category_type">
                        <option></option>
                        {
                            direction.map((item, index) => {
                                return <option value={item.id} key={index}>
                                    {item.name}
                                </option>
                            })
                        }
                    </select>

                    <label >1-viloyat:</label>
                    <select disabled={regions1} onChange={getInputs} id="address1" name="address1">
                        <option></option>
                        {
                            adress1.map((item, index) => {
                                return <option value={item.id} key={index}>
                                    {item.name}
                                </option>
                            })
                        }
                    </select>

                    <label>Kategoriya</label>
                    <select  id="category" onChange={getInputs} name="category">
                        <option></option>
                        {
                            category.map((item, index) => {
                                return <option value={item.id} key={index}>
                                    {item.name} &nbsp; &nbsp;
                                    {item.min_weight} &nbsp; - &nbsp;
                                    {item.max_weight}
                                </option>
                            })
                        }
                    </select>

                    <label >Haydovchi rasmi:</label>
                    <input id="image" onChange={getImage} name="image" type="file"/>

                    <label >Moshina rasmi</label>
                    <input id="car_image" onChange={getImage} name="car_image" type="file"/>

                </div>
                <div className="main-sides">
                    <input id="last_name" onChange={getInputs} name="last_name" placeholder="Familiya" type="text"/>
                    <input id="car_number" onChange={getInputs} name="car_number" placeholder="Moshina raqami"
                           type="text"/>
                    <input id="widht" onChange={getInputs} name="widht" placeholder="Uzunligi" type="text"/>
                    <input id="height" onChange={getInputs} name="height" placeholder="Moshina balandligi" type="text"/>
                    <input id="cargo_weight" onChange={getInputs} name="cargo_weight" placeholder="Yuk vazni"
                           type="text"/>

                    <label >Davlatlar:</label>
                    <select id="country1" disabled={country1} onChange={getInputs} name="country1">
                        <option></option>
                        {
                            country.map((item, index) => {
                                return <option value={item.name} key={index}>
                                    {item.name}
                                </option>
                            })
                        }
                    </select>

                    <label >2- viloyat:</label>
                    <select id="address2" disabled={regions2} onChange={getInputs} name="address2">
                        <option></option>
                        {
                            adress2.map((item, index) => {
                                return <option value={item.id} key={index}>
                                    {item.name}
                                </option>
                            })
                        }
                    </select>

                    <label >Kuzov turi:</label>
                    <select id="car_body" onChange={getInputs} name="car_body">
                        <option></option>
                        {carBodyList.map((item, index) => {
                            return <option value={item.id} key={index}>{item.name}</option>
                        })}

                    </select>

                    <label >Prava:</label>
                    <input id="drivers_license_image" onChange={getImage} name="drivers_license_image" type="file"/>

                    <label >Tex passport:</label>
                    <input id="car_tex_passport" onChange={getImage} name="car_tex_passport" type="file"/>
                </div>
            </div>

            <div className="buttons">
                <div onClick={() => setShowEdit(false)} className="cancel-btn">Bekor qilish</div>
                <div onClick={editDriver2} className="edit-btn">Tahrirlash</div>
            </div>
        </div>

        <div className="table-content">

            <table>
                <thead>
                <tr>
                    <th>№</th>
                    <th>F.I.SH</th>
                    <th>Tel</th>
                    <th>Haydovchi rasmi</th>
                    <th>Yo'nalish</th>
                    <th>Manzil</th>
                    <th>Kategoriya</th>
                    <th>Moshina raqami</th>
                    <th>Moshina Nomi</th>
                    <th>Moshina uzunligi</th>
                    <th>Moshina kengligi</th>
                    <th>Moshina balandligi</th>
                    <th>Kub</th>
                    <th>Yuk vazni</th>
                    <th>Kuzov turi</th>
                    <th>Moshina rasmi</th>
                    <th>Tex passport</th>
                    <th>Haydovchilik guvohnomasi</th>
                    <th>Tasdiqlash</th>
                    <th>Bloklash</th>
                    <th>Tahrirlash</th>
                </tr>
                </thead>
                <tbody>
                {MainList.filter((item) => {
                    return getSearchText.toLowerCase() === ""
                        ? item
                        : item.phone.toLowerCase().includes(getSearchText);
                }).map((item, index) => {
                    return <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                            {item.first_name} <br/>
                            {item.last_name}
                        </td>
                        <td>{item.phone}</td>
                        <td>
                            <div>
                                {item.image ?
                                    <img onClick={() => {
                                        setDocUrl(item.image)
                                        setViewDoc(true)
                                    }} src="../images/admin/view.png" alt=""/> : ""}
                            </div>
                        </td>

                        <td>{item.documentation ? item.documentation.category_type : null}</td>
                        <td>{item.documentation ? item.documentation.address : null}</td>

                        <td>{item.documentation ? item.documentation.category.name : null}</td>
                        <td>{item.documentation ? item.documentation.car_number : null}</td>
                        <td>{item.documentation ? item.documentation.name : null}</td>
                        <td>{item.documentation ? item.documentation.widht : null}</td>
                        <td>{item.documentation ? item.documentation.breadth : null}</td>
                        <td>{item.documentation ? item.documentation.height : null}</td>
                        <td>{item.documentation ? item.documentation.cargo_volume : null}</td>
                        <td>{item.documentation ? item.documentation.cargo_weight : null}</td>
                        <td>{item.documentation ? item.documentation.car_body.name : null}</td>

                        <td>
                            <div>
                                {item.documentation ?
                                    <img onClick={() => {
                                        setDocUrl(item.documentation.car_image)
                                        setViewDoc(true)
                                    }} src="../images/admin/photo.png" alt=""/> : ""}
                            </div>
                        </td>

                        <td>
                            <div>
                                {item.car_tex_passport ?
                                    <img onClick={() => {
                                        setDocUrl(item.car_tex_passport)
                                        setViewDoc(true)
                                    }} src="../images/admin/view.png" alt=""/> : ""}
                            </div>
                        </td>

                        <td>
                            <div>
                                {item.drivers_license_image ?
                                    <img onClick={() => {
                                        setDocUrl(item.drivers_license_image)
                                        setViewDoc(true)
                                    }} src="../images/admin/view.png" alt=""/> : ""}
                            </div>
                        </td>
                        <td>
                            <div>
                                {item.is_verified ? <img onClick={() => {
                                        axios.post(`${value.url}dashboard/drivers/${item.id}/verify/`, {}, {
                                            headers: {
                                                "Authorization": `Token ${localStorage.getItem("token")}`
                                            }
                                        }).then(() => {
                                            getList(Pages[activeItem - 1][activeItem])
                                        }).catch(() => {

                                        });

                                    }} src={`../images/admin/verified.png`} alt=""/> :
                                    <img onClick={() => {
                                        axios.post(`${value.url}dashboard/drivers/${item.id}/verify/`, {}, {
                                            headers: {
                                                "Authorization": `Token ${localStorage.getItem("token")}`
                                            }
                                        }).then(() => {
                                            getList(Pages[activeItem - 1][activeItem])
                                        }).catch(() => {

                                        });

                                    }} src={`../images/admin/verified1.png`} alt=""/>}
                            </div>
                        </td>
                        <td>
                            <div>
                                {item.is_block ? <img onClick={() => {
                                        axios.post(`${value.url}dashboard/drivers/${item.id}/block/`, {}, {
                                            headers: {
                                                "Authorization": `Token ${localStorage.getItem("token")}`
                                            }
                                        }).then(() => {
                                            getList(Pages[activeItem - 1][activeItem])
                                        }).catch(() => {

                                        });

                                    }} src={`../images/admin/block.png`} alt=""/> :
                                    <img onClick={() => {
                                        axios.post(`${value.url}dashboard/drivers/${item.id}/block/`, {}, {
                                            headers: {
                                                "Authorization": `Token ${localStorage.getItem("token")}`
                                            }
                                        }).then(() => {
                                            getList(Pages[activeItem - 1][activeItem])
                                        }).catch(() => {

                                        });

                                    }} src={`../images/admin/block1.png`} alt=""/>}
                            </div>
                        </td>
                        <td>
                            <div>
                                <img onClick={() => {
                                    editDriver(item);
                                    setUserId(item.id);
                                    setShowEdit(true)
                                }
                                } src={`../images/admin/edit.png`} alt=""/>

                            </div>
                        </td>
                    </tr>
                })}
                </tbody>
            </table>
        </div>

        <div className="pagination">
            <div className="prev">
                <img onClick={() => {
                    if (activeItem > 1) {
                        getList(links.previous);
                        setActiveItem(activeItem - 1)
                    }
                }} src="./images/admin/prev.png" alt=""/>
            </div>

            {
                Pages.map((item, index) => {
                    return <div onClick={() => {
                        getList(item[index + 1]);
                        setActiveItem(index + 1)
                    }} key={index} className={`items ${activeItem === index + 1 ? "active" : ""} `}>{index + 1}</div>
                })
            }

            <div onClick={() => {

                if (activeItem < Pages.length) {
                    getList(links.next)
                    setActiveItem(activeItem + 1)
                }
            }} className="next">
                <img src="./images/admin/next.png" alt=""/>
            </div>

        </div>

        <div className={`view-docs ${!viewDoc ? "hide" : ""}`}>
            <div className="for-image">
                <div className="cancel-btn">
                    <img onClick={getDownloadFile} src="./images/download.png" alt=""/>
                    <img onClick={() => setViewDoc(false)} src="../images/admin/close.png" alt=""/>
                </div>
                <div className="for-img">
                    <img src={docUrl} alt=""/>
                </div>
            </div>
        </div>
    </div>
};

export default Driver