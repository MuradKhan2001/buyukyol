import {useContext, useEffect, useMemo, useRef, useState} from "react";
import "./PostOrder.scss"
import Navbar from "../navbar/Navbar";
import {useTranslation} from "react-i18next";
import axios from "axios";
import i18next from "i18next";
import {MyContext} from "../app/App";
import {GoogleMap, InfoWindow, Marker, useLoadScript } from "@react-google-maps/api";
import {GOOGLE_MAPS_API_KEY} from './googleMapsApi';
import ReactStars from 'react-stars'
import usePlacesAutocomplete, {
    getGeocode, getLatLng,
} from "use-places-autocomplete";
import {
    Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import {CSSTransition} from "react-transition-group";
import LoaderAdmin from "./LoaderAdmin";
import Slider from "react-slick";
import {useNavigate} from "react-router-dom";


const libraries = ['places'];
let websocket = null, location;
navigator.geolocation.getCurrentPosition(position => {
    const {latitude, longitude} = position.coords;
    location = `${latitude}/${longitude}`
    websocket = new WebSocket(`wss://api.buyukyol.uz/ws/orders/${location}/?token=${localStorage.getItem('token')}`);

}, (error) => {
   if (window.innerWidth > 768) alert("Geolocaiton is turned off!")
});

const PostOrder = () => {
    let value = useContext(MyContext);
    const navigate = useNavigate();
    const {t} = useTranslation();
    const nodeRef = useRef(null);
    const ref = useRef(null);
    const ref2 = useRef(null);
    const [alerts, setAlerts] = useState([])
    const [cancelOrder, setCancelOrder] = useState(false);
    const [formBox, setFormBox] = useState(false);
    const [reason, setReason] = useState("");

    const [categoryType, setCategoryType] = useState([]);
    const [cars, setCars] = useState([]);
    const [categoryId, setCategoryId] = useState("");
    const [plusInfo, setPlusInfo] = useState(false)
    const [currency, setCurrency] = useState("UZS")
    const [infoCargo, setInfoCargo] = useState(false)
    const [cargo, setCargo] = useState({
        command: "new_order",
        price: "",
        client: "",
        car_category: "",
        car_body_type: "",
        type: "",
        address_from: "",
        latitude_from: "",
        longitude_from: "",
        address_to: "",
        latitude_to: "",
        longitude_to: "",
        cargo: "",
        capacity: "",
        unit: t("infoWaits1"),
        currency: "UZS",
        avans: null,
        payment_type: "",
        wait_cost: null,
        wait_type: t("waitCount1"),
        load_time: null,
        start_time: null,
        number_cars: 1
    })
    const [direction, setDirection] = useState("")
    const [carsImage, setCarImage] = useState("")
    const [carsId, setCarId] = useState("")
    const [CountOrders, setCountOrders] = useState(0)
    const [cargoInfo, setCargoInfo] = useState({})
    const [distance, setDistance] = useState("");
    const [cargoId, setCargoId] = useState("")

    const [locationName, setLocationName] = useState("")
    const [location1, setLocation1] = useState(false)
    const [location2, setLocation2] = useState(false)
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selected, setSelected] = useState(null);
    const [selectedMy, setSelectedMy] = useState(null)
    const [center, setCenter] = useState(null);
    const [locationName1, setLocationName1] = useState("")
    const [locationName2, setLocationName2] = useState("")

    const [driverList, setDriverList] = useState(false)
    const [activeDriversList, setActiveDriversList] = useState([]);
    const [DriversList, setDriversList] = useState([])
    const [DriversListRaid, setDriversListRaid] = useState([])
    const [raidCount, setRaidCount] = useState(0)
    const settingsForStills = {
        dots: false,
        infinite: false,
        speed: 1000,
        autoplay: false,
        slidesToShow: 3,
        slidesToScroll: 3,
        initialSlide: 1,
        responsive: [{
            breakpoint: 1024, settings: {
                slidesToShow: 3, slidesToScroll: 3, infinite: true, dots: true
            }
        }, {
            breakpoint: 600, settings: {
                slidesToShow: 3, slidesToScroll: 3, initialSlide: 1
            }
        }, {
            breakpoint: 480, settings: {
                slidesToShow: 3, slidesToScroll: 3
            }
        }]
    };

    const icon = {url: './images/truck-icon3.png', scaledSize: {width: 50, height: 47}};
    const icon2 = {url: './images/myicon.png', scaledSize: {width: 65, height: 60}};
    const icon3 = {url: './images/selectLoc.png', scaledSize: {width: 45, height: 45}};

    useEffect(() => {
        if (websocket) {
            websocket.onclose = () => {
                window.location.reload()
            }

            websocket.onmessage = (event) => {

                const data = JSON.parse(event.data);

                if (!('status' in data.message)) {

                    let driver = data.message.filter((item) => (item.status !== "Delivered"))
                    setDriversList(driver)

                    let raidDriver = data.message.filter((item) => (item.status === "Delivered"))
                    setDriversListRaid(raidDriver)

                }

                if (data.message.status) {

                    if (data.message.status === "canceled") {

                        let id = Date.now()
                        let newAlerts = {
                            id, text: t("alert2"), color: "#932626", img: "./images/caution.png"
                        }
                        setAlerts(prevState => [...prevState, newAlerts])
                        alertRemove(3000, id)
                        setInfoCargo(false)

                        setCancelOrder(false)

                        setDriversList(prevState => prevState.filter(item => item.order_id !== data.message.order_id))
                        setActiveDriversList(prevState => prevState.filter(item => item.order_id !== data.message.order_id))
                    }

                    if (data.message.status === "confirmed" || data.message.status === "Added") {
                        let id = Date.now()
                        let newAlerts = {
                            id, text: t("alert1"), color: "#218823", img: "./images/check-mark.png"
                        }
                        setAlerts(prevState => [...prevState, newAlerts])
                        alertRemove(3000, id)

                        setInfoCargo(false)
                        orderCount();
                        setFormBox(false)
                        setDirection("")
                        setCategoryId("")
                        setCarId("")
                        setLocationName1("")
                        setLocationName2("")

                        let cargoBox = {
                            command: "new_order",
                            price: "",
                            client: "",
                            car_category: "",
                            car_body_type: "",
                            type: "",
                            address_from: "",
                            latitude_from: "",
                            longitude_from: "",
                            address_to: "",
                            latitude_to: "",
                            longitude_to: "",
                            cargo: "",
                            capacity: "",
                            unit: t("infoWaits1"),
                            currency: "UZS",
                            avans: null,
                            payment_type: "",
                            wait_cost: null,
                            wait_type: t("waitCount1"),
                            load_time: null,
                            start_time: null,
                            number_cars: 1
                        }
                        setCargo(cargoBox)
                    }

                    if (data.message.status === "distance") {
                        setDistance(data.message.distance)
                    }

                    if (data.message.status === "Price") {
                        setCargoInfo(data.message)
                    }

                    if (data.message.status === "Accepted") {
                        let id = Date.now()
                        let newAlerts = {
                            id, text: t("alert8"), color: "#218823", img: "./images/check-mark.png"
                        }
                        setAlerts(prevState => [...prevState, newAlerts])
                        alertRemove(30000, id)

                        let driver = data.message
                        setDriversList(prevDriversList => [...prevDriversList, driver])
                    }

                    if (data.message.status === "delivering") {
                        let id = Date.now()
                        let newAlerts = {
                            id, text: t("alert9"), color: "#218823", img: "./images/check-mark.png"
                        }
                        setAlerts(prevState => [...prevState, newAlerts])
                        alertRemove(30000, id)
                    }

                    if (data.message.status === "delivered") {
                        let id = Date.now()
                        let newAlerts = {
                            id, text: t("alert10"), color: "#218823", img: "./images/check-mark.png"
                        }
                        setAlerts(prevState => [...prevState, newAlerts])
                        alertRemove(30000, id)

                        updateDriversList(data.message.id)

                    }

                    if (data.message.status === 'location') {
                        const update = (prevState) => {
                            let driver = prevState.filter(item => item.driver != data.message.driver[0].driver)
                            return [...driver, data.message.driver[0]]
                        }
                        setActiveDriversList(update)
                    }

                }

                if (data.message.status === false) {

                    if (data.message === "invalid token") {
                        window.location.pathname = "/login-client";
                        localStorage.removeItem("token");
                        localStorage.removeItem("userId");
                        localStorage.removeItem("user_name");
                    }

                }


            };
        }

        axios.get(`${value.url}api/car-category/`).then((response) => {
            let re = response.data.reverse();
            setCategoryType(re);
        }).catch((error) => {
            if (error.response.statusText == "Unauthorized") {
                window.location.pathname = "/login-client";
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                localStorage.removeItem("user_name");
            }
        });

        orderCount()
    }, []);

    useEffect(() => {
        if (websocket) {
            const web = new WebSocket(`wss://api.buyukyol.uz/ws/orders/${location}/?token=${localStorage.getItem('token')}`)

            web.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (!('status' in data.message)) {

                    let driver = data.message.filter((item) => (item.status !== "Delivered"))
                    setDriversList(driver)

                    let raidDriver = data.message.filter((item) => (item.status === "Delivered"))
                    setDriversListRaid(raidDriver)

                }
            }
        }
    }, []);

    const getInputs = (e) => {

        if (e.target.name === "capacity" || e.target.name === "price") {
            cargo[e.target.name] = Number(e.target.value);
        } else cargo[e.target.name] = e.target.value;

    };
    const orderCount = () => {

        axios.get(`${value.url}api/my-orders/`, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then((response) => {

            let count = response.data.filter((item) => item.status === "Active")
            setCountOrders(count.length);

        }).catch((error) => {
            if (error.response.statusText == "Unauthorized") {
                window.location.pathname = "/login-client";
                localStorage.removeItem("token");
                localStorage.removeItem("userId")
                localStorage.removeItem("user_name")
            }
        });
    }
    const alertRemove = (time, id) => {

        setTimeout(() => {
            setAlerts(prevAlerts => prevAlerts.filter(item => item.id !== id))
        }, time);

    }
    const updateDriversList = (id) => {
        const filter_driver = (prevState) => {
            let driver = prevState.filter(item => item.id === id)
            setDriversListRaid(driver)
            return prevState.filter(item => item.id !== id)
        }

        setDriversList(filter_driver)
    }
    const onloadMap = () => {
        navigator.geolocation.getCurrentPosition(position => {
            const {latitude, longitude} = position.coords;
            let locMy = {lat: latitude, lng: longitude}
            setCenter(locMy)
            setSelectedMy(locMy)
        });
    }
    const GetMyLocation = () => {
        navigator.geolocation.getCurrentPosition(position => {
            const {latitude, longitude} = position.coords;
            let locMy = {lat: latitude, lng: longitude}

            setCenter(locMy)
            setSelected(locMy)

            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&lan=en`;

            axios.get(`${url}`, {
                headers: {
                    "Accept-Language": i18next.language
                }
            }).then((res) => {

                let city = res.data.address.city;
                let country = res.data.address.country;
                let suburb = res.data.address.suburb;
                let neighbourhood = res.data.address.neighbourhood;
                let county = res.data.address.county;
                let road = res.data.address.road;

                let fullAddress = `${country ? country + "," : ""} ${city ? city + "," : ""} ${suburb ? suburb + "," : ""} 
            ${neighbourhood ? neighbourhood + "," : ""} ${county ? county + "," : ""} ${road ? road : ""}`
                setLocationName(fullAddress)
            });

        });
    }
    const ClicklLocation = (e) => {

        let latitude = e.latLng.lat()
        let longitude = e.latLng.lng()

        let locMy = {lat: latitude, lng: longitude}
        setSelected(locMy)

        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&lan=en`;

        axios.get(`${url}`, {
            headers: {
                "Accept-Language": i18next.language
            }
        }).then((res) => {
            let city = res.data.address.city;
            let country = res.data.address.country;
            let suburb = res.data.address.suburb;
            let neighbourhood = res.data.address.neighbourhood;
            let county = res.data.address.county;
            let road = res.data.address.road;

            let fullAddress = `${country ? country + "," : ""} ${city ? city + "," : ""} ${suburb ? suburb + "," : ""} 
            ${neighbourhood ? neighbourhood + "," : ""} ${county ? county + "," : ""} ${road ? road : ""}`
            setLocationName(fullAddress)
        }).catch((error) => {

        });

    }
    const PlacesAutocomplete = ({setSelected}) => {

        const {
            ready, value, setValue, suggestions: {status, data}, clearSuggestions,
        } = usePlacesAutocomplete({
            requestOptions: {
                language: i18next.language,
            },
        });

        const handleSelect = async (address) => {
            setValue(address, false);
            clearSuggestions();
            setLocationName(address)

            const results = await getGeocode({address});
            const {lat, lng} = await getLatLng(results[0]);
            setSelected({lat, lng});
            setCenter({lat, lng});
        };

        return (<Combobox onSelect={handleSelect}>
            <ComboboxInput
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={!ready}
                className="combobox-input"
                placeholder={t("input1")}
            />
            <ComboboxPopover>
                <ComboboxList>
                    {status === "OK" && data.map(({place_id, description}) => (
                        <ComboboxOption key={place_id} value={description}/>))}
                </ComboboxList>
            </ComboboxPopover>
        </Combobox>);
    };
    const getAddressLocation = () => {
        if (location1) {
            if (locationName && selected) {

                cargo.address_from = locationName
                setLocationName1(locationName)
                setLocation1(false)
                setSelected(null)

                cargo.latitude_from = Number(selected.lat.toString().slice(0, 9))
                cargo.longitude_from = Number(selected.lng.toString().slice(0, 9))
                onloadMap()
            } else {
                let id = Date.now()
                let newAlerts = {
                    id, text: t("alert7"), color: "#9f9c1e", img: "./images/caution3.png"
                }
                setAlerts(prevState => [...prevState, newAlerts])
                alertRemove(3000, id)
            }

        }

        if (location2) {
            if (locationName && selected) {
                cargo.address_to = locationName
                setLocationName2(locationName)
                setLocation2(false)
                setSelected(null)

                cargo.latitude_to = Number(selected.lat.toString().slice(0, 9))
                cargo.longitude_to = Number(selected.lng.toString().slice(0, 9))
                onloadMap()
            } else {
                let id = Date.now()
                let newAlerts = {
                    id, text: t("alert7"), color: "#9f9c1e", img: "./images/caution3.png"
                }
                setAlerts(prevState => [...prevState, newAlerts])
                alertRemove(3000, id)
            }
        }

        if (cargo.address_from && cargo.address_to && direction === "Abroad") {
            let distance = {
                command: "getdistance",
                latitude_from: cargo.latitude_from,
                longitude_from: cargo.longitude_from,
                latitude_to: cargo.latitude_to,
                longitude_to: cargo.longitude_to
            }
            websocket.send(JSON.stringify(distance));
        }
    }
    const onMarkerClick = (location) => {
        setSelectedLocation(location);
    };
    const onCloseClick = () => {
        setSelectedLocation(null);
    };
    const SendOrder = (command) => {

        if (command === "new_order") {
            cargo.client = Number(localStorage.getItem("userId"))
            websocket.send(JSON.stringify(cargo));
        } else if (command === "cancel_order") {
            let order = {
                command: command, id: cargoInfo.id
            };
            websocket.send(JSON.stringify(order));
        } else if (command === "confirm_order") {
            let order = {
                command: command, id: cargoInfo.id
            };
            websocket.send(JSON.stringify(order));
        }

    };
    const cancelOrders = () => {

        let order = {
            command: "cancel_order", id: cargoId, reason, many: false
        };
        websocket.send(JSON.stringify(order));

    }
    const sendRaid = (id, did) => {

        let raidList = {
            driver: id, delivery: did, mark: raidCount
        }

        axios.post(`${value.url}api/comment/`, raidList, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then((response) => {

            let id = Date.now()
            let newAlerts = {
                id, text: t("raidDriverText"), color: "#218823", img: "./images/check-mark.png"
            }
            setAlerts(prevState => [...prevState, newAlerts])
            setInfoCargo(false)
            alertRemove(3000, id)

            setDriversListRaid(prevAlerts => prevAlerts.filter((item, index) => index > 0))

        }).catch((error) => {
            if (error.response.statusText == "Unauthorized") {
                window.location.pathname = "/";
                localStorage.removeItem("token");
            }
        });

    }
    const cancelRaid = (id) => {

        let cancelRaid = {
            command: "unrate", id: id
        }

        websocket.send(JSON.stringify(cancelRaid));
        setDriversListRaid(prevAlerts => prevAlerts.filter((item, index) => index > 0))
    }

    const {isLoaded} = useLoadScript({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY, libraries: libraries, language: i18next.language
    });
    const options = useMemo(() => ({
        disableDefaultUI: false, clickableIcons: false
    }), []);
    if (!isLoaded) return <LoaderAdmin/>;

    return <div className="order-wrapper">
        <div className="mirror-sloy">
            <Navbar/>
            <div className="order-contents">

                {alerts.length > 0 && <div className="alerts-box">
                    {alerts.map((item, index) => {
                        return <div key={index} style={{color: item.color}} className="alert-style">
                            <div className="img-box">
                                <img src={item.img} alt=""/>
                            </div>
                            <div className="text-box">
                                {item.text}
                            </div>
                            <div onClick={() => alertRemove(0, item.id)} className="close">
                                <img src="./images/close-driver-list.png" alt=""/>
                            </div>
                        </div>
                    })}
                </div>}

                <CSSTransition
                    in={cancelOrder}
                    nodeRef={nodeRef}
                    timeout={300}
                    classNames="alert"
                    unmountOnExit
                >
                    <div className="reason-list">
                        <div ref={nodeRef} className="orders-reason-box">
                            <div className="title">
                                <div></div>
                                <div>
                                    {t("reasonText")}
                                </div>
                                <div className="cancel">
                                    <img onClick={() => {
                                        setCancelOrder(false);
                                        setReason("")
                                    }} src="./images/close-driver-list.png" alt=""/>
                                </div>
                            </div>
                            <div className="cancel-order-info">
                                <form id="radios">
                                    <div>
                                        <input onChange={(e) => {
                                            setReason(e.target.value);
                                            document.getElementById("reason4").value = ""
                                        }}
                                               id="reason1" type="radio" name="money"
                                               value={t("reason1")}/>
                                        <label htmlFor="reason1">{t("reason1")}</label>
                                    </div>

                                    <div>
                                        <input onChange={(e) => {
                                            document.getElementById("reason4").value = ""
                                            setReason(e.target.value)
                                        }} id="reason2" type="radio"
                                               name="money"
                                               value={t("reason2")}/>
                                        <label htmlFor="reason2">{t("reason2")}</label>
                                    </div>

                                    <div>
                                        <input onChange={(e) => {
                                            document.getElementById("reason4").value = "";
                                            setReason(e.target.value)
                                        }} id="reason3" type="radio"
                                               name="money"
                                               value={t("reason3")}/>
                                        <label htmlFor="reason3">{t("reason3")}</label>
                                    </div>
                                </form>
                                <div>
                                    <input onClick={() => document.getElementById("radios").reset()}
                                           placeholder={t("reason4")}
                                           onChange={(e) => {
                                               setReason(e.target.value);
                                           }} id="reason4"
                                           type="text" name="money"/>
                                </div>

                                <div onClick={() => {
                                    if (reason) {
                                        cancelOrders();
                                    } else {
                                        let id = Date.now()
                                        let newAlerts = {
                                            id, text: t("reasonAlert"), color: "#9f9c1e", img: "./images/caution3.png"
                                        }
                                        setAlerts(prevState => [...prevState, newAlerts])
                                        alertRemove(3000, id)
                                    }
                                }} className="cancel-btn">{t("button2")}
                                </div>
                            </div>
                        </div>
                    </div>

                </CSSTransition>

                <CSSTransition
                    in={driverList}
                    nodeRef={nodeRef}
                    timeout={300}
                    classNames="alert"
                    unmountOnExit
                >

                    <div className="all-drivers-list">
                        <div ref={nodeRef} className="info-cargo">
                            <div className="title">
                                <div></div>
                                <div>  {t("driver")}</div>
                                <div>
                                    <img onClick={() => setDriverList(false)} src="./images/close-driver-list.png"
                                         alt=""/>
                                </div>
                            </div>
                            {DriversList.map((item, index) => {
                                return <div key={index} className="driver">

                                    <div className="section-one">
                                        <div className="driver-image">
                                            <img src={`https://api.buyukyol.uz/${item.driver.image}`} alt=""/>
                                        </div>

                                        <div className="text">
                                            <div className="names">
                                                {item.driver.first_name}  &nbsp;
                                                {item.driver.last_name}
                                            </div>
                                            <div className="info-car">
                                                <div>
                                                    <img src="./images/truck.png"
                                                         alt=""/> {item.driver.documentation ? item.driver.documentation.name : ""}
                                                </div>
                                                <div>
                                                    <img src="./images/carnumber.png"
                                                         alt=""/> {item.driver.documentation ? item.driver.documentation.car_number : ""}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="section-two">
                                        <a href={`tel:${item.driver.phone}`} className="phone">
                                            <img src="./images/phone.png" alt=""/>
                                            {item.driver.phone}
                                        </a>

                                        <div onClick={() => {
                                            setCancelOrder(true);
                                            setCargoId(item.order_id)
                                        }} className="cancel-btn">
                                            {t("button3")}
                                            <img src="./images/xbtn.png" alt=""/>
                                        </div>
                                    </div>
                                </div>
                            })}

                        </div>
                    </div>

                </CSSTransition>

                <CSSTransition
                    in={infoCargo}
                    nodeRef={nodeRef}
                    timeout={300}
                    classNames="alert"
                    unmountOnExit
                >

                    <div className="all-information-cargo">
                        <div ref={nodeRef} className="info-cargo">

                            <div className="information-box">

                                <div className="img-box">
                                    <div className="car-image">
                                        <img src={`https://api.buyukyol.uz/${carsImage}`} alt=""/>
                                    </div>
                                </div>

                                <div className="left-box">
                                    <div className="location-box">
                                        <div className="name">
                                            {t("loc1")}:
                                        </div>

                                        <div className="location">
                                            <img src="./images/location-pin.png" alt=""/>
                                            {cargo.address_from}
                                        </div>
                                    </div>

                                    <div className="location-box">
                                        <div className="name">
                                            {t("loc3")}:
                                        </div>
                                        <div className="location">
                                            <img src="./images/location-pin.png" alt=""/>
                                            {cargo.address_to}
                                        </div>
                                    </div>

                                    <div className="line"></div>

                                    <div className="info-order">
                                        <div className="label-order">
                                            {t("info1")}
                                        </div>
                                        <div className="text-order">
                                            {cargo.type === "OUT" ? t("direction2") : ""}
                                            {cargo.type === "IN" ? t("direction3") : ""}
                                            {cargo.type === "Abroad" ? t("direction1") : ""}
                                        </div>
                                    </div>
                                    <div className="info-order">
                                        <div className="label-order">
                                            {t("info2")}
                                        </div>
                                        <div className="text-order">
                                            {cargo.cargo}
                                        </div>
                                    </div>
                                    <div className="info-order">
                                        <div className="label-order">
                                            {t("info7")}
                                        </div>
                                        <div className="text-order">
                                            {cargo.type !== "Abroad" ? cargoInfo.distance : distance} km
                                        </div>
                                    </div>

                                    <div className="info-order">
                                        <div className="label-order">
                                            {t("info8")}
                                        </div>
                                        <div className="text-order">
                                            {cargo.price ? cargo.price : cargoInfo.price} {cargo.currency}
                                        </div>
                                    </div>
                                </div>

                                <div className="right-box">

                                    <div className="info-order">
                                        <div className="label-order">
                                            {t("info10")}
                                        </div>
                                        <div className="text-order">
                                            {cargo.payment_type}
                                        </div>
                                    </div>

                                    <div className="info-order">
                                        <div className="label-order">
                                            {t("info3")}
                                        </div>
                                        <div className="text-order">
                                            {cargo.number_cars}
                                        </div>
                                    </div>

                                    <div className="info-order">
                                        <div className="label-order">
                                            {t("info5")}
                                        </div>
                                        <div className="text-order">
                                            {categoryType.map((item, index) => {
                                                if (item.id === cargo.car_category) {
                                                    return <div key={index}>
                                                        {item.min_weight} - {item.max_weight} {t("infoWaits4")},
                                                        {item.name === "Мини" && t("tariff1")}
                                                        {item.name === "Енгил" && t("tariff2")}
                                                        {item.name === "Ўрта" && t("tariff3")}
                                                        {item.name === "Оғир" && t("tariff4")}
                                                        {item.name === "Ўта оғир" && t("tariff5")}
                                                        {item.name === "Авто Ташувчи" && t("tariff6")}
                                                    </div>
                                                }
                                            })}
                                        </div>
                                    </div>

                                    <div className="info-order">
                                        <div className="label-order">
                                            {t("info6")}
                                        </div>
                                        <div className="text-order">
                                            {cars.map((item, index) => {
                                                if (item.id === cargo.car_body_type) {
                                                    return <div key={index}>
                                                        {item.name}
                                                    </div>
                                                }
                                            })}

                                        </div>
                                    </div>

                                    <div className="info-order">
                                        <div className="label-order">
                                            {t("info4")}
                                        </div>
                                        <div className="text-order">
                                            {cargo.capacity} {cargo.unit}
                                        </div>
                                    </div>

                                    <div className="info-order">
                                        <div className="label-order">
                                            {t("info9")}
                                        </div>
                                        <div className="text-order">
                                            {cargo.avans ? <> {cargo.avans} {cargo.currency} </> : "--"}
                                        </div>
                                    </div>

                                    <div className="info-order">
                                        <div className="label-order">
                                            {t("info11")}
                                        </div>
                                        <div className="text-order">
                                            {cargo.wait_cost ? <> {cargo.wait_cost} {cargo.currency}</> : "--"}
                                        </div>
                                    </div>

                                    <div className="info-order">
                                        <div className="label-order">
                                            {t("info12")}
                                        </div>
                                        <div className="text-order">
                                            {cargo.load_time ? <>
                                                {cargo.load_time.slice(0, 10)},
                                                {cargo.load_time.slice(11, 16)}
                                            </> : "--"}

                                        </div>
                                    </div>

                                    <div className="info-order">
                                        <div className="label-order">
                                            {t("info13")}
                                        </div>
                                        <div className="text-order">
                                            {cargo.start_time ? <>
                                                {cargo.start_time.slice(0, 10)},
                                                {cargo.start_time.slice(11, 16)}
                                            </> : "--"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <img className="clib-icon" src="./images/clip.png" alt=""/>
                            <div className="buttons">

                                <div onClick={() => {
                                    cargo.type !== "Abroad" ? SendOrder("cancel_order") : setInfoCargo(false)
                                }} className="button-cancel">
                                    {t("button3")}
                                    <img src="./images/xbtn.png" alt=""/>
                                </div>

                                <div onClick={() => {
                                    cargo.type !== "Abroad" ? SendOrder("confirm_order") : SendOrder("new_order")
                                }} className="button-send">
                                    {t("button2")}
                                    <img src="./images/verified.png" alt=""/>
                                </div>

                            </div>
                        </div>
                    </div>

                </CSSTransition>

                {DriversListRaid.length > 0 && <div className="raid-driver">
                    <div className="driver">

                        <div className="header">
                            <div></div>
                            <div className="title">{t("raidDriver")}</div>
                            <img onClick={() => cancelRaid(DriversListRaid[0].id)}
                                 src="./images/close-driver-list.png"
                                 alt=""/>
                        </div>

                        <div className="section-one">
                            <div className="driver-image">
                                <img src={`https://api.buyukyol.uz/${DriversListRaid[0].driver.image}`} alt=""/>
                            </div>

                            <div className="text">
                                <div className="names">
                                    {DriversListRaid[0].driver.first_name}
                                    &nbsp;
                                    {DriversListRaid[0].driver.last_name}
                                </div>

                                <div className="info-car">
                                    <div>
                                        <img src="./images/truck2.png" alt=""/>
                                        {DriversListRaid[0].driver.documentation ? DriversListRaid[0].driver.documentation.name : ""}
                                    </div>
                                    <div>
                                        <img src="./images/carnumber2.png" alt=""/>
                                        {DriversListRaid[0].driver.documentation ? DriversListRaid[0].driver.documentation.car_number : ""}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="section-two">

                            <a href={`tel:${DriversListRaid[0].driver.phone}`} className="phone">
                                <img src="./images/phone2.png" alt=""/>
                                {DriversListRaid[0].driver.phone}
                            </a>

                            <ReactStars
                                count={5}
                                onChange={(e) => {
                                    setRaidCount(e)
                                }} size={32}
                                color2={'#dcdb35'}
                                half={false}/>

                        </div>

                        <div className="footer">
                            <div onClick={() => sendRaid(DriversListRaid[0].driver.id, DriversListRaid[0].id)}
                                 className="send-btn">
                                {t("sentButton")}
                                <img src="./images/send.png" alt=""/>
                            </div>
                        </div>

                    </div>
                </div>}

                <div className="left-side">
                    <div className="get-location-container">

                        <div className={`header ${location1 || location2 ? "header-show" : ""}`}>
                            <div className="text">

                                {location1 ? <>
                                    <img src="./images/placeholder.png" alt=""/>
                                    {t("loc2")}
                                </> : <>
                                    <img src="./images/placeholder2.png" alt=""/>
                                    {t("loc4")}
                                </>}

                            </div>

                            <div className="forms">
                                <div className="places-container">
                                    <PlacesAutocomplete setSelected={setSelected}/>
                                    <img src="./images/magnifier.png" alt=""/>
                                </div>

                                <div onClick={GetMyLocation} className="my-location">
                                    <img src="./images/myLocation.png" alt=""/>
                                    Joriy joylashuv
                                </div>

                                <div onClick={getAddressLocation} className="get-location">
                                    {t("location")}
                                    <img src="./images/verified.png" alt=""/>
                                </div>
                            </div>
                        </div>

                        <GoogleMap
                            zoom={10}
                            onLoad={onloadMap}
                            center={center}
                            options={options}
                            onClick={location1 || location2 ? ClicklLocation : {}}
                            mapContainerClassName="map-box">

                            {selectedMy && <Marker icon={icon2} position={selectedMy}/>}

                            {selected && <Marker icon={icon3} position={selected}/>}

                            {activeDriversList.length >= 0 && !location1 && !location2 ?

                                <>
                                    {activeDriversList.map((item) => {
                                        return <Marker
                                            key={item.driver}
                                            position={{lat: Number(item.latitude), lng: Number(item.longitude)}}
                                            icon={icon}
                                            onClick={() => onMarkerClick(item)}
                                        />
                                    })}

                                    {selectedLocation && (<InfoWindow
                                        position={{
                                            lat: Number(selectedLocation.latitude),
                                            lng: Number(selectedLocation.longitude)
                                        }}
                                        onCloseClick={onCloseClick}
                                    >
                                        <div className="info-box-car">
                                            <div className="info-text">
                                                <span>Moshina raqam:</span>
                                                {selectedLocation.car_number} <br/>
                                                <span>Tel raqam:</span>
                                                {selectedLocation.phone_number}
                                            </div>
                                        </div>
                                    </InfoWindow>)}

                                </>

                                : ""}

                            {CountOrders > 0 && !location1 && !location2 &&
                                <div onClick={() => navigate("/my-profile")} className="orders-count">
                                    <div className="loader-box">
                                        <div className="loader"></div>
                                    </div>
                                    <div className="text1">
                                        {t("bagsCount")}:
                                        <div className="num">
                                            <img src="./images/Cardboard_Box2.png" alt=""/>
                                            {CountOrders}
                                        </div>
                                    </div>
                                    <div className="text2">
                                        {t("wait")}
                                    </div>
                                </div>}

                            {DriversList[0] && !location1 && !location2 && <div className="drivers-count">

                                <div onClick={() => setDriverList(true)} className="driver">
                                    <div className="top-side">
                                        <div className="driver-image">
                                            <img src={`https://api.buyukyol.uz/${DriversList[0].driver.image}`}
                                                 alt=""/>
                                        </div>

                                        <div className="name">
                                            {DriversList[0].driver.first_name}  &nbsp;
                                            {DriversList[0].driver.last_name}
                                        </div>
                                    </div>

                                    <div className="body-side">
                                        <div className="text">
                                            <img src="./images/truck.png" alt=""/>
                                            {DriversList[0].driver.documentation ? DriversList[0].driver.documentation.name : ""}
                                        </div>
                                        <div className="text">
                                            <img className="num" src="./images/carnumber.png" alt=""/>
                                            {DriversList[0].driver.documentation ? DriversList[0].driver.documentation.car_number : ""}
                                        </div>
                                    </div>
                                </div>

                                <div onClick={() => setDriverList(true)} className="all-drivers">
                                    <img src="./images/more.png" alt=""/>
                                </div>

                            </div>}

                        </GoogleMap>
                    </div>
                </div>

                <div className="right-side">

                    <div className="title">
                        <img src="./images/Cardboard_Box2.png" alt=""/>
                        {t("post-order")}
                    </div>

                    <div className="title-forms">
                        {t("direction")}
                    </div>

                    <div className="directions-container">

                        <div onClick={() => {
                            cargo.type = "IN";
                            setDirection("IN")
                            setFormBox(true)
                            if (direction === "IN") {
                                setDirection("")
                                setFormBox(false)
                            }
                        }} className={`direction-card ${direction === "IN" ? "active-direction" : ""}`}>
                            {direction === "IN" && <div className="tick-icon">
                                <img src="./images/tick.png" alt=""/>
                            </div>}
                            <div className="img-box">
                                <img src="./images/shaharichi.png" alt=""/>
                            </div>
                            <div>{t("direction3")}</div>
                        </div>

                        <div onClick={() => {
                            cargo.type = "OUT";
                            setDirection("OUT")
                            setFormBox(true)
                            if (direction === "OUT") {
                                setDirection("")
                                setFormBox(false)
                            }
                        }} className={`direction-card ${direction === "OUT" ? "active-direction" : ""}`}>
                            {direction === "OUT" && <div className="tick-icon">
                                <img src="./images/tick.png" alt=""/>
                            </div>}

                            <div className="img-box">
                                <img src="./images/shahararo.png" alt=""/>
                            </div>

                            <div>{t("direction2")}</div>
                        </div>


                        <div onClick={() => {
                            cargo.type = "Abroad";
                            setDirection("Abroad")
                            setFormBox(true)
                            if (direction === "Abroad") {
                                setDirection("")
                                setFormBox(false)
                            }
                            if (cargo.address_from && cargo.address_to) {
                                let distance = {
                                    command: "getdistance",
                                    latitude_from: cargo.latitude_from,
                                    longitude_from: cargo.longitude_from,
                                    latitude_to: cargo.latitude_to,
                                    longitude_to: cargo.longitude_to
                                }
                                websocket.send(JSON.stringify(distance));
                            }
                        }}
                             className={`direction-card ${direction === "Abroad" ? "active-direction" : ""}`}>
                            {direction === "Abroad" && <div className="tick-icon">
                                <img src="./images/tick.png" alt=""/>
                            </div>}

                            <div className="img-box">
                                <img src="./images/xalqaro.png" alt=""/>
                            </div>

                            <div>{t("direction1")}</div>
                        </div>

                    </div>

                    <CSSTransition
                        in={formBox}
                        nodeRef={nodeRef}
                        timeout={300}
                        classNames="alert"
                        unmountOnExit
                    >
                        <div ref={nodeRef}>
                            {direction && <>
                                <div className="title-forms">
                                    {t("tariff")}
                                </div>

                                <div className="tariff-container">

                                    <Slider {...settingsForStills} >
                                        {categoryType.map((item, index) => {
                                            return <div key={index} className="click-slide-box" onClick={() => {
                                                setCategoryId((item.id))
                                                cargo.car_category = item.id

                                                setTimeout(() => {
                                                    ref.current?.scrollIntoView({behavior: 'smooth'});
                                                }, 500);

                                                axios.get(`${value.url}api/car-category/${item.id}`, {}).then((response) => {
                                                    let re = response.data.reverse();
                                                    setCars(re);
                                                })
                                            }}>
                                                <div
                                                    className={`tariff-card ${categoryId === item.id && "tariff-active"} `}>

                                                    {categoryId === item.id && <div className="tick-icon">
                                                        <img src="./images/tick.png" alt=""/>
                                                    </div>}

                                                    <img src={item.image} alt=""/>

                                                    <div className="info-category">
                                                        <div className="name">
                                                            {item.name === "Мини" && t("tariff1")}
                                                            {item.name === "Енгил" && t("tariff2")}
                                                            {item.name === "Ўрта" && t("tariff3")}
                                                            {item.name === "Оғир" && t("tariff4")}
                                                            {item.name === "Ўта оғир" && t("tariff5")}
                                                            {item.name === "Авто Ташувчи" && t("tariff6")}
                                                        </div>
                                                        <div className="info-weight">
                                                            {item.id !== 9 && <>
                                                                {item.min_weight} - {item.max_weight} tonna
                                                            </>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        })}
                                    </Slider>

                                </div>
                            </>}

                            {categoryId && <>
                                <div ref={ref} className="title-forms">
                                    {t("trucks")}
                                </div>

                                <div className="cars-containers">
                                    <Slider {...settingsForStills} >
                                        {cars.map((item, index) => {
                                            return <div key={index} className="click-slide-box" onClick={() => {
                                                cargo.car_body_type = item.id
                                                setCarImage(item.car_image)
                                                setCarId(item.id)
                                                setTimeout(() => {
                                                    ref2.current?.scrollIntoView({behavior: 'smooth'});
                                                }, 300);
                                            }}>
                                                <div
                                                    className={`cars-card ${item.id === carsId && "cars-active"} `}>

                                                    {item.id === carsId && <div className="tick-icon">
                                                        <img src="./images/tick.png" alt=""/>
                                                    </div>}

                                                    <div className="cars-info">
                                                        <div className="text">
                                                            <div className="name">
                                                                {t("infoTruck1")}:
                                                            </div>
                                                            <div className="num">{item.widht}</div>
                                                        </div>

                                                        <div className="text">
                                                            <div className="name">
                                                                {t("infoTruck2")}:
                                                            </div>
                                                            <div className="num">{item.breadth}</div>
                                                        </div>

                                                        <div className="text">
                                                            <div className="name">
                                                                {t("infoTruck3")}:
                                                            </div>
                                                            <div className="num">{item.height}</div>
                                                        </div>

                                                        <div className="text">
                                                            <div className="name">
                                                                {t("infoTruck4")}:
                                                            </div>
                                                            <div className="num">
                                                                {categoryId !== 9 ? item.cargo_weight / 1000 : item.cargo_weight}
                                                            </div>
                                                        </div>

                                                    </div>

                                                    <div className="car-image">
                                                        <img src={`https://api.buyukyol.uz/${item.car_image}`}
                                                             alt=""/>
                                                    </div>
                                                    <div className="car-name">
                                                        {item.name}
                                                    </div>
                                                </div>
                                            </div>
                                        })}
                                    </Slider>
                                </div>
                            </>}

                            {carsId && <>
                                <div ref={ref2} className="title-forms">
                                    {t("plusInformation")}
                                </div>

                                <div className="form-informations">

                                    <div  className="input-box">
                                        <div className="icon-input">
                                            <img src="./images/tracking.png" alt=""/>
                                        </div>
                                        <input  onChange={getInputs} name="cargo" placeholder={t("info2")} type="text"/>
                                    </div>

                                    <div className="input-box">

                                        <div className="icon-input">
                                            <select onChange={getInputs} name="unit" id="unit">
                                                <option value={t("infoWaits1")}>
                                                    {t("infoWaits1")}
                                                </option>

                                                <option value={t("infoWaits2")}>
                                                    {t("infoWaits2")}
                                                </option>

                                                <option value={t("infoWaits3")}>
                                                    {t("infoWaits3")}
                                                </option>

                                                <option value={t("infoWaits4")}>
                                                    {t("infoWaits4")}
                                                </option>

                                                <option value={t("infoWaits5")}>
                                                    {t("infoWaits5")}
                                                </option>

                                                <option value={t("infoWaits6")}>
                                                    {t("infoWaits6")}
                                                </option>
                                            </select>
                                        </div>

                                        <input onChange={getInputs} name="capacity" placeholder={t("infoTruck4")}
                                               type="text"/>
                                    </div>

                                    <div onClick={() => {
                                        setLocation1(true)
                                        setLocation2(false)
                                    }} className="input-box">
                                        <div className="icon-input">
                                            <img src="./images/location-pin.png" alt=""/>
                                        </div>
                                        <div className="loc1">

                                            {locationName1 ? locationName1 :
                                                <span>{t("loc1")}</span>}

                                        </div>
                                    </div>

                                    <div onClick={() => {
                                        setLocation2(true)
                                        setLocation1(false)
                                    }} className="input-box">
                                        <div className="icon-input">
                                            <img src="./images/location-pin.png" alt=""/>
                                        </div>
                                        <div className="loc1">
                                            {locationName2 ? locationName2 : <span>{t("loc3")}</span>}
                                        </div>
                                    </div>

                                    {cargo.type === "Abroad" && distance && <div className="distanse">
                                        <div className="label-dostance">
                                            {t("info7")}
                                        </div>
                                        <div className="num-distance">
                                            {distance} km
                                        </div>
                                    </div>}

                                    {cargo.type === "Abroad" && <div className="input-box">

                                        <div className="icon-input">
                                            <select onChange={(e) => {
                                                getInputs(e)
                                                setCurrency(e.target.value)
                                            }} name="currency" id="currency">
                                                <option value="UZS">
                                                    UZS
                                                </option>

                                                <option value="USD">
                                                    USD
                                                </option>

                                            </select>
                                        </div>

                                        <input onChange={getInputs} name="price" placeholder={t("info8")} type="text"/>
                                    </div>}

                                    <div className="payment-type">
                                        <label htmlFor="type1" className="first-type">

                                            <div className="img">
                                                <img src="./images/money-bag.png" alt=""/>
                                            </div>

                                            <div className="inputs">
                                                <input onChange={getInputs} id="type1" type="radio" name="payment_type"
                                                       value={t("payment1")}/>
                                            </div>

                                            <div className="text">
                                                <label htmlFor="type1">{t("payment1")}</label>
                                            </div>
                                        </label>
                                        <label htmlFor="type2" className="first-type">

                                            <div className="img">
                                                <img src="./images/card-payment.png" alt=""/>
                                            </div>

                                            <div className="inputs">
                                                <input onChange={getInputs} name="payment_type" id="type2" type="radio"
                                                       value={t("payment2")}/>
                                            </div>

                                            <div className="text">
                                                <label htmlFor="type2">{t("payment2")}</label>
                                            </div>
                                        </label>
                                    </div>

                                    <div onClick={() => setPlusInfo(!plusInfo)} className="plus-info">
                                        <div></div>
                                        <div className="text">
                                            {t("plusInformation")}
                                        </div>
                                        <img src={`./images/arrow${plusInfo ? "" : "2"}.png`} alt=""/>
                                    </div>

                                    <CSSTransition
                                        in={plusInfo}
                                        nodeRef={nodeRef}
                                        timeout={300}
                                        classNames="alert"
                                        unmountOnExit
                                    >
                                        <div ref={nodeRef} className="connent-info">

                                            <div className="input-box">

                                                <div className="icon-input">
                                                    <img src="./images/add-package.png" alt=""/>
                                                </div>

                                                <input className="input2" onChange={getInputs} name="number_cars"
                                                       placeholder={t("info3")} type="number"/>
                                            </div>

                                            <label htmlFor="load_time">{t("info12")}</label>
                                            <div className="input-box">
                                                <div className="icon-input">
                                                    <img src="./images/clock.png" alt=""/>
                                                </div>
                                                <input className="input2" onChange={getInputs} id="load_time"
                                                       name="load_time"
                                                       placeholder={t("info2")}
                                                       type="datetime-local"/>
                                            </div>
                                            <label htmlFor="start_time">{t("info13")}</label>
                                            <div className="input-box">
                                                <div className="icon-input">
                                                    <img src="./images/clock.png" alt=""/>
                                                </div>
                                                <input className="input2" onChange={getInputs} id="start_time"
                                                       name="start_time"
                                                       placeholder={t("info2")}
                                                       type="datetime-local"/>
                                            </div>


                                            <div className="input-box">

                                                <div className="icon-input">
                                                    <img src="./images/money.png" alt=""/>
                                                </div>

                                                <input onChange={getInputs} name="wait_cost" placeholder={t("info11")}
                                                       type="text"/>

                                                <div className="icon-input2">
                                                    {currency}/
                                                    <select onChange={getInputs} name="wait_type" id="unit">
                                                        <option value={t("waitCount1")}>
                                                            {t("waitCount1")}
                                                        </option>

                                                        <option value={t("waitCount2")}>
                                                            {t("waitCount2")}
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="input-box">

                                                <div className="icon-input">
                                                    <img src="./images/money.png" alt=""/>
                                                </div>

                                                <input onChange={getInputs} name="avans" placeholder={t("info9")}
                                                       type="text"/>

                                                <div className="icon-input2">
                                                    {currency}
                                                </div>
                                            </div>

                                        </div>

                                    </CSSTransition>


                                </div>

                                <div onClick={() => {

                                    if (cargo.type !== "Abroad" && cargo.cargo && cargo.capacity && cargo.address_from && cargo.address_to && cargo.payment_type) {
                                        SendOrder("new_order")
                                        setInfoCargo(true)
                                    } else if (cargo.type === "Abroad" && cargo.cargo && cargo.capacity && cargo.address_from && cargo.address_to && cargo.payment_type && cargo.price) {
                                        setInfoCargo(true)
                                    } else {
                                        let id = Date.now()
                                        let newAlerts = {
                                            id, text: t("alert3"), color: "#9f9c1e", img: "./images/caution3.png"
                                        }
                                        setAlerts(prevState => [...prevState, newAlerts])
                                        alertRemove(3000, id)
                                    }

                                }} className="button-next">
                                    {t("button1")}
                                    <img src="./images/arrowr.png" alt=""/>
                                </div>
                            </>}

                        </div>

                    </CSSTransition>


                </div>
            </div>
            <div className="mobile">
                <div className="title">
                    {t('alertText')}
                </div>

                <div className="button-box">
                    <a href="https://play.google.com/store/apps/details?id=com.khurshid28.client_buyuk_yol"
                       target="_blank">
                        <button>
                            <div className="icon">
                                <img src="./images/androit.png" alt=""/>
                            </div>
                            <div className="text">
                                <div className="text-top"> GET IN ON</div>
                                <div className="text-bottom"> Google Play</div>
                            </div>
                        </button>
                    </a>
                    <a href="https://apps.apple.com/app/id6463604761" target="_blank">
                        <button>
                            <div className="icon">
                                <img src="./images/ios.png" alt=""/>
                            </div>
                            <div className="text">
                                <div className="text-top"> Download on the</div>
                                <div className="text-bottom">App Store</div>
                            </div>
                        </button>
                    </a>
                </div>
            </div>
        </div>

    </div>
};

export default PostOrder