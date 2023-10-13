import "./FilterDriver.scss"
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {MyContext} from "../../app/App";
import Driver from "../driver/Driver";

const FilterDriver = () => {
    let value = useContext(MyContext);
    const [MainList, setMainList] = useState([]);
    const [carBodyList, setCarBodyList] = useState([]);
    const [category, setCategory] = useState([]);

    const [country1, setCountry1] = useState(true);
    const [regions1, setRegions1] = useState(true);
    const [regions2, setRegions2] = useState(true);

    const [filterList, setFilterList] = useState(
        {
            category_type: "null",
            country1: "null",
            address1: "null",
            address2: "null",
            category: "null",
            car_body: "null",
            cargo_weight: "null"
        }
    );

    useEffect(() => {
        axios.get(`${value.url}api/car/`).then((response) => {
            setCarBodyList(response.data)
        }).catch(() => {

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

        filterList[e.target.name] = e.target.value;

        if (filterList.category_type === "IN") {
            setRegions1(false);

            setCountry1(true)
            setRegions2(true)
        }

        if (filterList.category_type === "OUT") {
            setRegions1(false);
            setRegions2(false);

            setCountry1(true)
        }

        if (filterList.category_type === "Abroad") {
            setCountry1(false)

            setRegions1(true);
            setRegions2(true);
        }
    };

    const filter = () => {
        axios.post(`${value.url}api/filter-drivers/`, filterList, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then((response) => {
            setMainList(response.data)
        }).catch(() => {

        });

    };

    return <div className="filter-driver">
        <div className="header-side">
            <div className="filter-box">
                <div className="inputs">
                    <div>
                        <label htmlFor="category_type">Yo'nalish turi:</label>
                        <select onChange={getInputs} name="category_type">
                            <option value="null">--</option>
                            {
                                direction.map((item, index) => {
                                    return <option value={item.id} key={index}>
                                        {item.name}
                                    </option>
                                })
                            }
                        </select>
                    </div>

                    <div>
                        <label htmlFor="country1">Davlatlar:</label>
                        <select disabled={country1} onChange={getInputs} name="country1">
                            <option value="null">--</option>

                            {
                                country.map((item, index) => {
                                    return <option value={item.name} key={index}>
                                        {item.name}
                                    </option>
                                })
                            }
                        </select>
                    </div>

                    <div>
                        <label htmlFor="address1">1-viloyat:</label>
                        <select disabled={regions1} onChange={getInputs} name="address1">
                            <option value="null">--</option>
                            {
                                adress1.map((item, index) => {
                                    return <option value={item.id} key={index}>
                                        {item.name}
                                    </option>
                                })
                            }
                        </select>
                    </div>

                    <div>
                        <label htmlFor="address2">2- viloyat:</label>
                        <select disabled={regions2} onChange={getInputs} name="address2">
                            <option value="null">--</option>
                            {
                                adress2.map((item, index) => {
                                    return <option value={item.id} key={index}>
                                        {item.name}
                                    </option>
                                })
                            }
                        </select>
                    </div>

                    <div>
                        <label>Kategoriya</label>
                        <select onChange={getInputs} name="category">
                            <option value="null">--</option>
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
                    </div>

                    <div>
                        <label>Kuzov turi:</label>
                        <select onChange={getInputs} name="car_body">
                            <option value="null">--</option>
                            {carBodyList.map((item, index) => {
                                return <option value={item.name} key={index}>{item.name}</option>
                            })}

                        </select>
                    </div>

                    <div>
                        <label>Og'irlik:</label>
                        <input onChange={getInputs} name="cargo_weight" type="text"/>
                    </div>
                </div>

                <div className="filter-btn">
                    <img onClick={filter} src="../images/admin/filter.png" alt=""/>
                </div>
            </div>
        </div>

        <div className="table-content">
            <table>
                <thead>
                <tr>
                    <th>№</th>
                    <th>F.I.SH</th>
                    <th>Tel</th>
                    <th>Kategoriya</th>
                    <th>Kuzov turi</th>
                    <th>Yo'nalishi</th>
                    <th>Og'irligi</th>
                    <th>Manzil</th>
                </tr>
                </thead>

                <tbody>
                {
                    MainList.map((item, index) => {
                        return <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.name}</td>
                            <td>{item.phone}</td>
                            <td>{item.category}</td>
                            <td>{item.car_body}</td>
                            <td>{item.category_type}</td>
                            <td>{item.cargo_weight}</td>
                            <td>{item.address}</td>
                        </tr>
                    })
                }
                </tbody>
            </table>
        </div>
    </div>
};

export default FilterDriver