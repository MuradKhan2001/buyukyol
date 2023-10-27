import "./PostOrder.scss"
import Navbar from "../navbar/Navbar";
import {useTranslation} from "react-i18next";
import {useContext, useEffect, useMemo, useRef, useState} from "react";
import axios, {get} from "axios";
import i18next from "i18next";
import {MyContext} from "../app/App";
import {GoogleMap, InfoWindow, Marker, useLoadScript} from "@react-google-maps/api";
import LoaderAdmin from "../admin/admin home/LoaderAdmin";
import {CSSTransition} from "react-transition-group";

const API_KEY = "AIzaSyAT1gB8sob8_piFwfeu3AaTL15yHyjuc30";


const websocket = new WebSocket(`wss://api.buyukyol.uz/ws/orders/Tashkent/uzbekistan/?token=${localStorage.getItem('token')}`);

const PostOrder = () => {
    let value = useContext(MyContext);
    const {t} = useTranslation();
    const [categoryType, setCategoryType] = useState([]);
    const [cars, setCars] = useState([]);
    const [categoryId, setCategoryId] = useState("");
    const [plusInfo, setPlusInfo] = useState(false)
    const [driverList, setDriverList] = useState(false)
    const [currency, setCurrency] = useState("UZS")
    const [infoCargo, setInfoCargo] = useState(false)
    const [locationsList, setLocationsList] = useState([]);
    const nodeRef = useRef(null);

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
        unit: "",
        currency: "UZS",
        avans: "",
        payment_type: "",
        wait_cost: "",
        wait_type: "",
        load_time: null,
        start_time: null,
        number_cars: 1
    })
    const [direction, setDirection] = useState("")
    const [carsImage, setCarImage] = useState("")
    const [carsId, setCarId] = useState("")


    const getInputs = (e) => {
        cargo[e.target.name] = e.target.value;
    };

    useEffect(() => {

        axios.get(`${value.url}api/car-category/`, {
            headers: {
                "Accept-Language": i18next.language ? i18next.language : "uz"
            }
        }).then((response) => {
            let re = response.data.reverse();
            setCategoryType(re);
        }).catch((error) => {
            if (error.response.statusText == "Unauthorized") {
                window.location.pathname = "/";
                localStorage.removeItem("token");
            }
        });


    }, []);


    const [selectedLocation, setSelectedLocation] = useState(null);

    const onMarkerClick = (location) => {
        setSelectedLocation(location);
    };

    const onCloseClick = () => {
        setSelectedLocation(null);
    };

    const {isLoaded} = useLoadScript({
        googleMapsApiKey: API_KEY
    });

    const center = useMemo(() => ({lat: 41, lng: 65}), []);

    const options = useMemo(() => ({
        mapId: sessionStorage.getItem("style"), disableDefaultUI: false, clickableIcons: false
    }), []);

    if (!isLoaded) return <LoaderAdmin/>;

    const icon = {url: './images/admin/truck-icon2.png', scaledSize: {width: 45, height: 45}};


    return <div className="order-wrapper">
        <Navbar/>
        <div className="order-contents">
            <div className="left-side">

                <GoogleMap

                    zoom={5}
                    center={center}
                    options={options}
                    mapContainerClassName="map-container">

                    <div className="orders-count">
                        <div className="loader-box">
                            <div className="loader"></div>
                        </div>
                        <div className="text1">
                            {t("bagsCount")}:
                            <div className="num">
                                <img src="./images/Cardboard_Box2.png" alt=""/>
                                10
                            </div>
                        </div>
                        <div className="text2">
                            {t("wait")}
                        </div>
                    </div>

                    <div className="drivers-count">
                        <div className="driver">
                            <div className="top-side">
                                <div className="driver-image">
                                    <img src="./images/person.jpg" alt=""/>
                                </div>
                                <div className="name">
                                    Jack Stiven
                                </div>
                            </div>

                            <div className="body-side">
                                <div className="text">
                                    MAN
                                </div>
                                <div className="text">
                                    L288SA
                                </div>
                            </div>

                            <div className="label-text">
                                Qabul qilingan...
                            </div>
                            <div className="cancel-btn">
                                {t("button3")}
                            </div>
                        </div>

                        <div onClick={() => setDriverList(true)} className="all-drivers">
                            <img src="./images/more.png" alt=""/>
                        </div>
                    </div>

                    {locationsList.length >= 0 ?

                        <>
                            {locationsList.map((item) => {
                                return <Marker
                                    key={Number(item.latitude)}
                                    position={{lat: Number(item.latitude), lng: Number(item.longitude)}}
                                    icon={icon}
                                    onClick={() => onMarkerClick(item)}
                                />
                            })}

                            {selectedLocation && (<InfoWindow
                                position={{
                                    lat: Number(selectedLocation.latitude), lng: Number(selectedLocation.longitude)
                                }}
                                onCloseClick={onCloseClick}
                            >
                                <div className="info-box">
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


                </GoogleMap>

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
                        cargo.type = "Abroad";
                        setDirection("Abroad")
                    }}
                         className={`direction-card ${direction === "Abroad" ? "active-direction" : ""}`}>
                        <img src="./images/xalqaro.png" alt=""/>
                        <div>{t("direction1")}</div>
                    </div>

                    <div onClick={() => {
                        cargo.type = "OUT";
                        setDirection("OUT")
                    }} className={`direction-card ${direction === "OUT" ? "active-direction" : ""}`}>
                        <img src="./images/shahararo.png" alt=""/>
                        <div>{t("direction2")}</div>
                    </div>

                    <div onClick={() => {
                        cargo.type = "IN";
                        setDirection("IN")
                    }} className={`direction-card ${direction === "IN" ? "active-direction" : ""}`}>
                        <img src="./images/shaharichi.png" alt=""/>
                        <div>{t("direction3")}</div>
                    </div>

                </div>

                <div className="title-forms">
                    {t("tariff")}
                </div>

                <div className="tariff-container">

                    {categoryType.map((item, index) => {
                        return <div key={index} onClick={() => {
                            setCategoryId((item.id))
                            cargo.car_category = item.id
                            axios.get(`${value.url}api/car-category/${item.id}`, {
                                headers: {
                                    "Accept-Language": i18next.language ? i18next.language : "uz"
                                }
                            }).then((response) => {
                                let re = response.data.reverse();
                                setCars(re);
                                console.log(re)
                            }).catch((error) => {
                                if (error.response.statusText == "Unauthorized") {
                                    window.location.pathname = "/";
                                    localStorage.removeItem("token");
                                }
                            });
                        }}>
                            <div className={`tariff-card ${categoryId === item.id && "tariff-active"} `}>
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
                </div>

                <div className="title-forms">
                    {t("trucks")}
                </div>

                <div className="cars-containers">
                    {cars.map((item, index) => {
                        return <div key={index} onClick={() => {
                            cargo.car_body_type = item.id
                            setCarImage(item.car_image)
                            setCarId(item.id)
                        }}>
                            <div className={`cars-card ${item.id === carsId && "cars-active"} `}>
                                <div className="cars-info">
                                    <div className="text">
                                        <div className="name">
                                            {t("infoTruck1")}
                                        </div>
                                        <div className="num">{item.widht}</div>
                                    </div>

                                    <div className="text">
                                        <div className="name">
                                            {t("infoTruck2")}
                                        </div>
                                        <div className="num">{item.breadth}</div>
                                    </div>

                                    <div className="text">
                                        <div className="name">
                                            {t("infoTruck3")}
                                        </div>
                                        <div className="num">{item.height}</div>
                                    </div>

                                    <div className="text">
                                        <div className="name">
                                            {t("infoTruck4")}
                                        </div>
                                        <div className="num">{item.cargo_weight / 1000}</div>
                                    </div>

                                </div>

                                <div className="car-image">
                                    <img src={`https://api.buyukyol.uz/${item.car_image}`} alt=""/>
                                </div>
                                <div className="car-name">
                                    {item.name}
                                </div>
                            </div>
                        </div>
                    })}
                </div>

                <div className="title-forms">
                    {t("plusInformation")}
                </div>

                <div className="form-informations">

                    <div className="input-box">
                        <div className="icon-input">
                            <img src="./images/tracking.png" alt=""/>
                        </div>
                        <input placeholder={t("info2")} type="text"/>
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

                        <input onChange={getInputs} name="capacity" placeholder={t("infoTruck4")} type="text"/>
                    </div>

                    <div className="input-box">
                        <div className="icon-input">
                            <img src="./images/location-pin.png" alt=""/>
                        </div>
                        <div className="loc1">
                            {t("loc1")}
                        </div>
                    </div>

                    <div className="input-box">
                        <div className="icon-input">
                            <img src="./images/location-pin.png" alt=""/>
                        </div>
                        <div className="loc1">
                            {t("loc3")}
                        </div>
                    </div>

                    {cargo.type === "Abroad" && <div className="distanse">
                        <div className="label-dostance">
                            {t("info7")}
                        </div>
                        <div className="num-distance">
                            km
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

                            <label htmlFor="load_time">{t("info12")}</label>
                            <div className="input-box">
                                <div className="icon-input">
                                    <img src="./images/clock.png" alt=""/>
                                </div>
                                <input className="input2" onChange={getInputs} id="load_time" name="load_time"
                                       placeholder={t("info2")}
                                       type="datetime-local"/>
                            </div>
                            <label htmlFor="start_time">{t("info13")}</label>
                            <div className="input-box">
                                <div className="icon-input">
                                    <img src="./images/clock.png" alt=""/>
                                </div>
                                <input className="input2" onChange={getInputs} id="start_time" name="start_time"
                                       placeholder={t("info2")}
                                       type="datetime-local"/>
                            </div>


                            <div className="input-box">

                                <div className="icon-input">
                                    <img src="./images/money.png" alt=""/>
                                </div>

                                <input onChange={getInputs} name="wait_cost" placeholder={t("info11")} type="text"/>

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

                                <input onChange={getInputs} name="avans" placeholder={t("info9")} type="text"/>

                                <div className="icon-input2">
                                    {currency}
                                </div>
                            </div>

                        </div>

                    </CSSTransition>


                </div>

                <div onClick={() => {
                    setInfoCargo(true)
                }} className="button-next">
                    {t("button1")}
                </div>

            </div>

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
                           <div> <img onClick={()=>setDriverList(false)} src="./images/close-driver-list.png" alt=""/></div>
                        </div>
                        <div className="driver">
                            <div className="driver-image">
                                <img src="./images/person.jpg" alt=""/>
                            </div>

                            <div className="text">
                                <div className="names">Stiven Jack</div>
                                <div className="info-car">
                                    <div>
                                        MAN
                                    </div>
                                    <div>
                                        L288SA
                                    </div>
                                </div>
                            </div>

                            <img src="./images/phone.png" alt=""/>

                            <div className="cancel-btn">
                                {t("button3")}
                            </div>

                        </div>
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
                        <div className="car-image">
                            <img src={`https://api.buyukyol.uz/${carsImage}`} alt=""/>
                        </div>

                        <div className="location-box">
                            <div className="name">
                                <img src="./images/location-pin.png" alt=""/>
                                {t("loc1")}
                            </div>
                            <div className="location">
                                {cargo.address_from}
                            </div>
                        </div>

                        <div className="location-box">
                            <div className="name">
                                <img src="./images/location-pin.png" alt=""/>
                                {t("loc3")}
                            </div>
                            <div className="location">
                                {cargo.address_to}
                            </div>
                        </div>

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
                                {cargo.distance} km
                            </div>
                        </div>

                        <div className="info-order">
                            <div className="label-order">
                                {t("info8")}
                            </div>
                            <div className="text-order">
                                {cargo.price} {cargo.currency}
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
                                {t("info4")}
                            </div>
                            <div className="text-order">
                                {cargo.capacity} {cargo.unit}
                            </div>
                        </div>

                        <div className="info-order">
                            <div className="label-order">
                                {t("info5")}
                            </div>
                            <div className="text-order">
                                {cargo.car_category.min_weight ? cargo.car_category.min_weight : ""}-
                                {cargo.car_category.max_weight ? cargo.car_category.max_weight : ""} tonna,

                                {i18next.language === "ru" ? cargo.car_category.name_ru ? cargo.car_category.name_ru : "" : cargo.car_category.name ? cargo.car_category.name : ""}
                            </div>
                        </div>

                        <div className="info-order">
                            <div className="label-order">
                                {t("info6")}
                            </div>
                            <div className="text-order">
                                {i18next.language === "ru" ? cargo.car_body_type.name_ru ? cargo.car_body_type.name_ru : "" : cargo.car_body_type.name ? cargo.car_body_type.name : ""}
                            </div>
                        </div>

                        <div className="info-order">
                            <div className="label-order">
                                {t("info9")}
                            </div>
                            <div className="text-order">
                                {cargo.avans} {cargo.currency}
                            </div>
                        </div>

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
                                {t("info11")}
                            </div>
                            <div className="text-order">
                                {cargo.wait_cost} {cargo.currency}
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
                                </> : ""}

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
                                </> : ""}
                            </div>
                        </div>

                        <div className="buttons">

                            <div onClick={() => {
                                setInfoCargo(false)
                            }} className="button-cancel">
                                {t("button3")}
                            </div>

                            <div className="button-send">
                                {t("button2")}
                            </div>

                        </div>
                    </div>
                </div>

            </CSSTransition>


        </div>
    </div>
};

export default PostOrder