import "./driver.scss";
import {CSSTransition} from "react-transition-group";
import {useContext, useEffect, useState, useRef} from "react";
import axios from "axios";
import {MyContext} from "../../app/App";
import {saveAs} from "file-saver";
import LoaderAdmin from "../admin home/LoaderAdmin";

const Driver = () => {
    let value = useContext(MyContext);
    const nodeRef = useRef(null);
    const [modalShow, setModalShow] = useState({show: false, status: false});
    const [carInformation, setCarInformation] = useState([])
    const [getSearchText, setGetSearchText] = useState("");
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
    const [loader, setLoader] = useState(false);

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

    const getList = (url = null, page = 1) => {
        setLoader(true);

        const main = url ? url : `${value.url}dashboard/drivers/?page=${page}`;
        axios.get(main, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then((response) => {
            setMainList(response.data.results);
            setLinks(response.data.links);
            setPages(response.data.links.pages);
            setActiveItem(page);
        }).catch((error) => {
            if (error.response && error.response.statusText === "Unauthorized") {
                window.location.pathname = "/";
                localStorage.removeItem("token");
            }
        }).finally(() => {
            setLoader(false);
        });
        ;

    };

    const visiblePages = [];
    const totalPages = Pages.length;

    if (totalPages <= 7) {
        visiblePages.push(...Pages.map((_, index) => index + 1));
    } else {
        visiblePages.push(1);

        if (activeItem > 3) {
            visiblePages.push("...");
        }

        for (let i = Math.max(2, activeItem - 1); i <= Math.min(totalPages - 1, activeItem + 1); i++) {
            visiblePages.push(i);
        }

        if (activeItem < totalPages - 2) {
            visiblePages.push("...");
        }

        visiblePages.push(totalPages);
    }

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
                getList(null, activeItem);
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
                setModalShow({show: false, status: false})
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
            getList(null, activeItem);
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
            setModalShow({show: false, status: false})
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

        <CSSTransition
            in={modalShow.show}
            nodeRef={nodeRef}
            timeout={300}
            classNames="alert"
            unmountOnExit
        >
            <div
                className="modal-sloy">
                <div ref={nodeRef} className="modal-card">

                    {
                        modalShow.status === "info-car" &&
                        <div className="info-car">
                            <div className="cancel-btn">
                                <img
                                    onClick={() => {
                                        setModalShow({show: false, status: false})
                                    }}
                                    src="./images/admin/cancel.webp"
                                    alt="cancel"
                                />

                            </div>
                            <div className="title">Avtomobil ma'lumotlari</div>
                            <div className="info-box">
                                <div className="info">
                                    <div className="name">Yo'nalish</div>
                                    <div
                                        className="val">
                                        {carInformation.category_type && <>
                                            {carInformation.category_type === "Abroad" && "Xalqaro"}
                                            {carInformation.category_type === "IN" && "Shahar ichi"}
                                            {carInformation.category_type === "OUT" && "Shaharlar aro"}
                                        </>}

                                    </div>
                                </div>
                                <div className="info">
                                    <div className="name">Manzil</div>
                                    <div
                                        className="val">{carInformation.address && carInformation.address !== "undefined" && carInformation.address}</div>
                                </div>
                                <div className="info">
                                    <div className="name">Kategoriya</div>
                                    <div className="val">{carInformation.category && carInformation.category.name}</div>
                                </div>
                                <div className="info">
                                    <div className="name">Moshina raqami</div>
                                    <div className="val">{carInformation.category && carInformation.car_number}</div>
                                </div>
                                <div className="info">
                                    <div className="name">Moshina nomi</div>
                                    <div className="val">{carInformation.name && carInformation.name}</div>
                                </div>
                                <div className="info">
                                    <div className="name">Moshina uzunligi</div>
                                    <div className="val">{carInformation.widht && carInformation.widht}</div>
                                </div>
                                <div className="info">
                                    <div className="name">Moshina kengligi</div>
                                    <div className="val">{carInformation.breadth && carInformation.breadth}</div>
                                </div>
                                <div className="info">
                                    <div className="name">Moshina balandligi</div>
                                    <div className="val">{carInformation.height && carInformation.height}</div>
                                </div>
                                <div className="info">
                                    <div className="name">Kub</div>
                                    <div
                                        className="val">{carInformation.cargo_volume && carInformation.cargo_volume}</div>
                                </div>
                                <div className="info">
                                    <div className="name">Yuk vazni</div>
                                    <div
                                        className="val">{carInformation.cargo_weight && carInformation.cargo_weight}</div>
                                </div>
                                <div className="info">
                                    <div className="name">Kuzov turi</div>
                                    <div className="val">{carInformation.car_body && carInformation.car_body.name}</div>
                                </div>
                            </div>
                        </div>
                    }

                    {
                        modalShow.status === "add-driver" &&
                        <div className="add-driver">
                            <div className="cancel-btn">
                                <img
                                    onClick={() => {
                                        setModalShow({show: false, status: false})
                                    }}
                                    src="./images/admin/cancel.webp"
                                    alt="cancel"
                                />

                            </div>
                            <div className="title">Haydovchi qo'shish</div>
                            <div className="main-box">
                                <div className="main-sides">
                                    <input onChange={getInputs} name="first_name" placeholder="Ism" type="text"/>
                                    <input onChange={getInputs} name="phone" placeholder="Telefon raqam" type="text"/>
                                    <input onChange={getInputs} name="name" placeholder="Moshina nomi" type="text"/>
                                    <input onChange={getInputs} name="breadth" placeholder="Moshina kengligi"
                                           type="text"/>
                                    <input onChange={getInputs} name="cargo_volume" placeholder="Kub" type="text"/>

                                    <label>Yo'nalish turi:</label>
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

                                    <label>Kategoriya</label>
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

                                    <label>Haydovchi rasmi:</label>
                                    <input onChange={getImage} name="image" type="file"/>

                                    <label>Moshina rasmi</label>
                                    <input onChange={getImage} name="car_image" type="file"/>

                                </div>
                                <div className="main-sides">
                                    <input onChange={getInputs} name="last_name" placeholder="Familiya" type="text"/>
                                    <input onChange={getInputs} name="car_number" placeholder="Moshina raqami"
                                           type="text"/>
                                    <input onChange={getInputs} name="widht" placeholder="Uzunligi" type="text"/>
                                    <input onChange={getInputs} name="height" placeholder="Moshina balandligi"
                                           type="text"/>
                                    <input onChange={getInputs} name="cargo_weight" placeholder="Yuk vazni"
                                           type="text"/>

                                    <label>Davlatlar:</label>
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

                                    <label>2- viloyat:</label>
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

                                    <label>Kuzov turi:</label>
                                    <select onChange={getInputs} name="car_body">
                                        <option></option>
                                        {carBodyList.map((item, index) => {
                                            return <option value={item.id} key={index}>{item.name}</option>
                                        })}

                                    </select>

                                    <label>Prava:</label>
                                    <input onChange={getImage} name="drivers_license_image" type="file"/>

                                    <label>Tex passport:</label>
                                    <input onChange={getImage} name="car_tex_passport" type="file"/>
                                </div>
                            </div>
                            <div className="button">
                                <button onClick={addDriver}>
                                    Qo'shish
                                </button>
                            </div>

                        </div>
                    }

                    {
                        modalShow.status === "edit-driver" &&
                        <div className="edit-driver">
                            <div className="title">Tahrirlash</div>
                            <div className="main-box">
                                <div className="main-sides">
                                    <input id="first_name"
                                           name="first_name"
                                           placeholder="Ism"
                                           value={Driver.first_name}
                                           onChange={(e) => setDriver({...Driver, first_name: e.target.value})}
                                           type="text"/>

                                    <input id="phone"
                                           name="phone"
                                           placeholder="Telefon raqam"
                                           value={Driver.phone}
                                           onChange={(e) => setDriver({...Driver, phone: e.target.value})}
                                           type="text"/>

                                    <input id="name"
                                           name="name"
                                           placeholder="Moshina nomi"
                                           value={Driver.name}
                                           onChange={(e) => setDriver({...Driver, name: e.target.value})}
                                           type="text"/>

                                    <input id="breadth"
                                           name="breadth"
                                           placeholder="Moshina kengligi"
                                           value={Driver.breadth}
                                           onChange={(e) => setDriver({...Driver, breadth: e.target.value})}
                                           type="text"/>

                                    <input id="cargo_volume"
                                           name="cargo_volume"
                                           placeholder="Kub"
                                           value={Driver.cargo_volume}
                                           onChange={(e) => setDriver({...Driver, cargo_volume: e.target.value})}
                                           type="text"/>

                                    <label>Yo'nalish turi:</label>

                                    <select
                                        id="category_type"
                                        name="category_type"
                                        value={Driver.category_type}
                                        onChange={(e) => setDriver({...Driver, category_type: e.target.value})}>
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
                                    <select
                                        id="address1"
                                        value={Driver.address1}
                                        onChange={(e) => setDriver({...Driver, address1: e.target.value})}
                                        name="address1">
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
                                    <select id="category"
                                            value={Driver.category}
                                            onChange={(e) => setDriver({...Driver, category: e.target.value})}
                                            name="category">
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

                                    <label>Haydovchi rasmi:</label>
                                    <input id="image" onChange={getImage} name="image" type="file"/>

                                    <label>Moshina rasmi</label>
                                    <input id="car_image" onChange={getImage} name="car_image" type="file"/>

                                </div>
                                <div className="main-sides">
                                    <input id="last_name"
                                           name="last_name"
                                           placeholder="Familiya"
                                           value={Driver.last_name}
                                           onChange={(e) => setDriver({...Driver, last_name: e.target.value})}
                                           type="text"/>

                                    <input id="car_number"
                                           name="car_number"
                                           value={Driver.car_number}
                                           onChange={(e) => setDriver({...Driver, car_number: e.target.value})}
                                           placeholder="Moshina raqami"
                                           type="text"/>

                                    <input id="widht"
                                           name="widht"
                                           value={Driver.widht}
                                           onChange={(e) => setDriver({...Driver, widht: e.target.value})}
                                           placeholder="Uzunligi"
                                           type="text"/>

                                    <input id="height"
                                           name="height"
                                           value={Driver.height}
                                           onChange={(e) => setDriver({...Driver, height: e.target.value})}
                                           placeholder="Moshina balandligi" type="text"/>

                                    <input id="cargo_weight"
                                           name="cargo_weight"
                                           value={Driver.cargo_weight}
                                           onChange={(e) => setDriver({...Driver, cargo_weight: e.target.value})}
                                           placeholder="Yuk vazni"
                                           type="text"/>

                                    <label>Davlatlar:</label>
                                    <select id="country1"
                                            value={Driver.country1}
                                            onChange={(e) => setDriver({...Driver, country1: e.target.value})}
                                            name="country1">
                                        <option></option>
                                        {
                                            country.map((item, index) => {
                                                return <option value={item.name} key={index}>
                                                    {item.name}
                                                </option>
                                            })
                                        }
                                    </select>

                                    <label>2- viloyat:</label>
                                    <select id="address2"
                                            value={Driver.address2}
                                            onChange={(e) => setDriver({...Driver, address2: e.target.value})}
                                            name="address2">
                                        <option></option>
                                        {
                                            adress2.map((item, index) => {
                                                return <option value={item.id} key={index}>
                                                    {item.name}
                                                </option>
                                            })
                                        }
                                    </select>

                                    <label>Kuzov turi:</label>
                                    <select id="car_body"
                                            value={Driver.car_body}
                                            onChange={(e) => setDriver({...Driver, car_body: e.target.value})}
                                            name="car_body">
                                        <option></option>
                                        {carBodyList.map((item, index) => {
                                            return <option value={item.id} key={index}>{item.name}</option>
                                        })}

                                    </select>

                                    <label>Prava:</label>
                                    <input id="drivers_license_image" onChange={getImage} name="drivers_license_image"
                                           type="file"/>

                                    <label>Tex passport:</label>
                                    <input id="car_tex_passport" onChange={getImage} name="car_tex_passport"
                                           type="file"/>
                                </div>
                            </div>
                            <div className="buttons">
                                <div onClick={() => setModalShow({show: false, status: false})}
                                     className="cancel-btn">Bekor qilish
                                </div>
                                <div onClick={editDriver2} className="edit-btn">Tahrirlash</div>
                            </div>
                        </div>
                    }

                </div>
            </div>
        </CSSTransition>
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
        <div className="search-box">
            <div className="inputs">
                <input onChange={(e) => setGetSearchText(e.target.value)} placeholder="Tel nomer orqali izlash..."
                       type="text"/>
                <div className="serach-btn"><img src="../images/admin/search.png" alt=""/></div>
            </div>

            <div onClick={() => setModalShow({show: true, status: "add-driver"})} className="add-driver">
                Haydovchi qo'shish
                <img src="../images/admin/add1.png" alt=""/>
            </div>
        </div>
        <div className="table-content">
            {loader ? <LoaderAdmin/> : <table>
                <thead>
                <tr>
                    <th>№</th>
                    <th>F.I.SH</th>
                    <th>Haydovchi rasmi</th>
                    <th>Ma'lumotlar</th>
                    <th>Moshina rasmi</th>
                    <th>Tex passport</th>
                    <th>Haydovchilik guvohnomasi</th>
                    <th>Tasdiqlash</th>
                    <th>Bloklash</th>
                    <th>Tahrirlash</th>
                </tr>
                </thead>
                <tbody>
                {
                    MainList.filter((item) => {
                        return getSearchText.toLowerCase() === ""
                            ? item
                            : item.phone.toLowerCase().includes(getSearchText);
                    }).map((item, index) => {
                        return <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                                {item.first_name} &ensp;
                                {item.last_name} <br/>

                                <b>{item.phone}</b>
                            </td>
                            <td>
                                <div>
                                    {item.image ?
                                        <img onClick={() => {
                                            setDocUrl(item.image)
                                            setViewDoc(true)
                                        }} src="../images/admin/view.png" alt=""/> : ""}
                                </div>
                            </td>
                            <td>
                                <div>
                                    <img onClick={() => {
                                        setCarInformation(item.documentation ? item.documentation : {})
                                        setModalShow({show: true, status: "info-car"})
                                    }} src="./images/admin/docs.png" alt="docs"/>
                                </div>
                            </td>
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
                                                getList(null, activeItem);
                                            }).catch(() => {

                                            });

                                        }} src={`../images/admin/verified.png`} alt=""/> :
                                        <img onClick={() => {
                                            axios.post(`${value.url}dashboard/drivers/${item.id}/verify/`, {}, {
                                                headers: {
                                                    "Authorization": `Token ${localStorage.getItem("token")}`
                                                }
                                            }).then(() => {
                                                getList(null, activeItem);
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
                                                getList(null, activeItem);
                                            }).catch(() => {

                                            });

                                        }} src={`../images/admin/block.png`} alt=""/> :
                                        <img onClick={() => {
                                            axios.post(`${value.url}dashboard/drivers/${item.id}/block/`, {}, {
                                                headers: {
                                                    "Authorization": `Token ${localStorage.getItem("token")}`
                                                }
                                            }).then(() => {
                                                getList(null, activeItem);
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
                                        setModalShow({show: true, status: "edit-driver"})
                                    }
                                    } src={`../images/admin/edit.png`} alt=""/>

                                </div>
                            </td>
                        </tr>
                    })
                }
                </tbody>
            </table>}
        </div>

        <div className="pagination">
            <div className="prev">
                <img onClick={() => {
                    if (activeItem > 1) {
                        getList(links.previous, activeItem - 1);
                    }
                }} src="./images/admin/prev.png" alt="Prev"/>
            </div>

            {visiblePages.map((item, index) => (
                <div key={index}
                     onClick={() => {
                         if (item !== "...") {
                             getList(null, item);
                         }
                     }}
                     className={`items ${activeItem === item ? "active" : ""} `}
                     style={{cursor: item === "..." ? "default" : "pointer"}}>
                    {item}
                </div>
            ))}

            <div className="next" onClick={() => {
                if (activeItem < totalPages) {
                    getList(links.next, activeItem + 1);
                }
            }}>
                <img src="./images/admin/next.png" alt="Next"/>
            </div>
        </div>

    </div>
};

export default Driver