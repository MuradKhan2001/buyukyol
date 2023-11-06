import "./MyProfile.scss"
import Navbar from "../navbar/Navbar";
import {useTranslation} from "react-i18next";
import {useContext, useEffect, useRef, useState} from "react";
import axios from "axios";
import i18next from "i18next";
import {MyContext} from "../app/App";
import {CSSTransition} from "react-transition-group";

let websocket = null
let location
navigator.geolocation.getCurrentPosition(position => {
    const {latitude, longitude} = position.coords;
    location = `${latitude}/${longitude}`
    websocket = new WebSocket(`wss://api.buyukyol.uz/ws/orders/${location}/?token=${localStorage.getItem('token')}`);
});
const MyProfile = () => {
    let value = useContext(MyContext);
    const nodeRef = useRef(null);
    const {t} = useTranslation();

    const [user, setUser] = useState([]);
    const [menuUser, setMenuUser] = useState("1");
    const [ordersList, setOrdersList] = useState([]);
    const [newsList, setNewsList] = useState([]);
    const [cancelOrder, setCancelOrder] = useState(false);
    const [cancelOrder2, setCancelOrder2] = useState(false);
    const [alertCancel, setAlertCancel] = useState(false);
    const [reason, setReason] = useState("");
    const [cargoId, setCargoId] = useState("");
    const [many, setMany] = useState(false);
    const [alertForm, setAlertForm] = useState(false);

    useEffect(() => {

        if (websocket) {
            websocket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.message.status) {

                    if (data.message.status === "canceled") {
                        setAlertCancel(true);
                        setTimeout(() => {
                            setAlertCancel(false);
                        }, 3000);
                        setCancelOrder(false);
                        setCancelOrder2(false);

                        axios.get(`${value.url}api/my-orders/`, {
                            headers: {
                                "Authorization": `Token ${localStorage.getItem("token")}`
                            }
                        }).then((response) => {
                            setOrdersList(response.data);
                        }).catch((error) => {
                            if (error.response.statusText == "Unauthorized") {
                                window.location.pathname = "/";
                                localStorage.removeItem("token");
                                localStorage.removeItem("userId")
                            }
                        });
                    }

                } else console.log(data.message)
            };
        }


        axios.get(`${value.url}api/client/`, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then((response) => {
            setUser(response.data)
        }).catch((error) => {
            if (error.response.statusText == "Unauthorized") {
                window.location.pathname = "/";
                localStorage.removeItem("token");
                localStorage.removeItem("userId")
            }
        });

        axios.get(`${value.url}api/my-orders/`, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then((response) => {
            setOrdersList(response.data);
        }).catch((error) => {
            if (error.response.statusText == "Unauthorized") {
                window.location.pathname = "/";
                localStorage.removeItem("token");
                localStorage.removeItem("userId")
            }
        });

        axios.get(`${value.url}api/news/`, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            },
            params: {
                user_type: "Client"
            }
        }).then((response) => {
            setNewsList(response.data)
        }).catch((error) => {
            if (error.response.statusText == "Unauthorized") {
                window.location.pathname = "/";
                localStorage.removeItem("token");
            }
        });

    }, []);

    const PosOrder = () => {
        let order = {
            command: "cancel_order",
            id: cargoId,
            reason,
            many
        };

        websocket.send(JSON.stringify(order));
    };

    return <div className="my-profile-wrapper">
        <Navbar/>

        <CSSTransition
            in={alertCancel}
            nodeRef={nodeRef}
            timeout={300}
            classNames="alert"
            unmountOnExit
        >
            <div ref={nodeRef} className="alert-cancel">
                <div className="img-box">
                    <img src="./images/caution.png" alt=""/>
                </div>
                <div className="text-box">
                    {t("alert2")}
                </div>
                <div onClick={() => setAlertCancel(false)} className="close">
                    <img src="./images/close-driver-list.png" alt=""/>
                </div>
            </div>

        </CSSTransition>

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
                                    setReason(e.target.value)}} id="reason2" type="radio"
                                       name="money"
                                       value={t("reason2")}/>
                                <label htmlFor="reason2">{t("reason2")}</label>
                            </div>

                            <div>
                                <input onChange={(e) => {
                                    document.getElementById("reason4").value = "";
                                    setReason(e.target.value)}} id="reason3" type="radio"
                                       name="money"
                                       value={t("reason3")}/>
                                <label htmlFor="reason3">{t("reason3")}</label>
                            </div>
                        </form>
                        <div>
                            <input onClick={() => document.getElementById("radios").reset()} placeholder={t("reason4")}
                                   onChange={(e) => {
                                       setReason(e.target.value);
                                   }} id="reason4"
                                   type="text" name="money"/>
                        </div>

                        <div onClick={() => {
                            if (reason) {
                                PosOrder();
                            } else {
                                setAlertForm(true);
                                setTimeout(() => {
                                    setAlertCancel(false);
                                }, 3000);
                            }
                        }} className="cancel-btn">{t("button2")}
                        </div>
                    </div>
                </div>
            </div>

        </CSSTransition>

        <CSSTransition
            in={cancelOrder2}
            nodeRef={nodeRef}
            timeout={300}
            classNames="alert"
            unmountOnExit
        >
            <div className="reason-list">
                <div ref={nodeRef} className="orders-reason-box">
                    <div className="title">
                        <div></div>
                        <div>{t("reasonText1")}</div>
                        <div className="cancel">
                            <img onClick={() => {
                                setCancelOrder2(false);
                            }} src="./images/close-driver-list.png" alt=""/>
                        </div>
                    </div>
                    <div className="cancel-order-info">
                        <div>
                            <input onChange={() => setMany(true)} id="reasonYes" type="radio" name="reasons"/>
                            <label htmlFor="reasonYes">{t("yes")}</label>
                        </div>

                        <div>
                            <input checked={true} onChange={() => setMany(false)} id="reasonNo" type="radio"
                                   name="reasons"/>
                            <label htmlFor="reasonNo">{t("no")}</label>
                        </div>

                        <div onClick={() => {
                            setCancelOrder2(false);
                            setCancelOrder(true);
                        }} className="cancel-btn">{t("button2")}</div>
                    </div>
                </div>
            </div>

        </CSSTransition>

        <CSSTransition
            in={alertForm}
            nodeRef={nodeRef}
            timeout={300}
            classNames="alert"
            unmountOnExit
        >
            <div ref={nodeRef} className="alert-cancel">
                <div className="img-box">
                    <img src="./images/caution.png" alt=""/>
                </div>
                <div className="text-box">
                    {t("reasonAlert")}
                </div>
                <div onClick={() => setAlertForm(false)} className="close">
                    <img src="./images/close-driver-list.png" alt=""/>
                </div>
            </div>

        </CSSTransition>

        <div className="content-box">
            <div className="left-side">
                <div className="person-circle">
                    <img src="./images/profile.png" alt=""/>
                </div>

                <div className="names-user">
                    <div>
                        {user.first_name}
                    </div>
                    <div>
                        {user.last_name}
                    </div>
                </div>

                <div className="menues">

                    <div onClick={() => setMenuUser("1")}
                         className={`nav-items ${menuUser === "1" ? "nav-active" : ""}`}>
                        <div className="icon-item">
                            <img src="./images/time-order.png" alt=""/>
                        </div>
                        <div className="menu-name">{t('myMenu1')}</div>
                    </div>

                    <div onClick={() => setMenuUser("2")}
                         className={`nav-items ${menuUser === "2" ? "nav-active" : ""}`}>
                        <div className="icon-item">
                            <img src="./images/received.png" alt=""/>
                        </div>
                        <div className="menu-name">{t('myMenu2')}</div>
                    </div>

                    <div onClick={() => setMenuUser("5")}
                         className={`nav-items ${menuUser === "5" ? "nav-active" : ""}`}>
                        <div className="icon-item">
                            <img src="./images/shopping.png" alt=""/>
                        </div>
                        <div className="menu-name">{t('myMenu3')}</div>
                    </div>

                    <div onClick={() => setMenuUser("3")}
                         className={`nav-items ${menuUser === "3" ? "nav-active" : ""}`}>
                        <div className="icon-item">
                            <img src="./images/order-cancel.png" alt=""/>
                        </div>
                        <div className="menu-name">{t('myMenu4')}</div>
                    </div>

                    <div onClick={() => setMenuUser("4")}
                         className={`nav-items ${menuUser === "4" ? "nav-active" : ""}`}>
                        <div className="icon-item">
                            <img src="./images/notification.png" alt=""/>
                        </div>
                        <div className="menu-name">{t('news')}</div>
                    </div>
                </div>

            </div>

            <div className="right-side">
                {
                    menuUser === "1" ? <>
                        <div className="title">
                            <div className="icon-item">
                                <img src="./images/time-order.png" alt=""/>
                            </div>
                            <div className="menu-name">{t('myMenu1')}</div>
                        </div>
                        <div className="orders-box">
                            {
                                ordersList.map((item, index) => {
                                    if (item.status === "Active")
                                        return <div key={index} className="order">
                                            <div className="left-side-order">
                                                <div className="title-order2">
                                                    <div className="d-flex">
                                                        <div className="circle"></div>
                                                        {t("cargoLabel1")}
                                                    </div>
                                                    <div className="number">
                                                        <div className="name">
                                                            <img src="./images/Cardboard_Box2.png" alt=""/>
                                                            {t("numCargo")}
                                                        </div>
                                                        {item.id}
                                                    </div>
                                                </div>

                                                <div className="date-order">
                                                    <div className="title-date">{t("timeCargo1")}</div>
                                                    {item.ordered_time.slice(0, 10)},
                                                    {item.ordered_time.slice(11, 16)}
                                                </div>

                                                <div className="location-box">
                                                    <div className="icon-location">
                                                        <img src="./images/location-pin2.png" alt=""/>
                                                    </div>
                                                    <div className="text-location">
                                                        {item.address_from}
                                                    </div>
                                                </div>

                                                <div className="location-box">
                                                    <div className="icon-location">
                                                        <img src="./images/location-pin3.png" alt=""/>
                                                    </div>
                                                    <div className="text-location">
                                                        {item.address_to}
                                                    </div>
                                                </div>

                                                <div onClick={() => {
                                                    setCargoId(item.id);

                                                    if (item.number_cars > 1) {
                                                        setCancelOrder2(true)
                                                    } else setCancelOrder(true)

                                                }} className="cancel-btn">
                                                    {t("button3")}
                                                    <img src="./images/close.png" alt=""/>
                                                </div>

                                            </div>

                                            <div className="right-side-order">
                                                <div className="title-orders">{t("moreInfo")}</div>
                                                <div className="info-order">
                                                    <div className="label-order">
                                                        {t("info1")}
                                                    </div>
                                                    <div className="text-order">
                                                        {item.type === "OUT" ? t("direction2") : ""}
                                                        {item.type === "IN" ? t("direction3") : ""}
                                                        {item.type === "Abroad" ? t("direction1") : ""}
                                                    </div>
                                                </div>

                                                <div className="info-order">
                                                    <div className="label-order">
                                                        {t("info2")}
                                                    </div>
                                                    <div className="text-order">
                                                        {item.cargo}
                                                    </div>
                                                </div>

                                                <div className="info-order">
                                                    <div className="label-order">
                                                        {t("info7")}
                                                    </div>
                                                    <div className="text-order">
                                                        {item.distance} km
                                                    </div>
                                                </div>

                                                <div className="info-order">
                                                    <div className="label-order">
                                                        {t("info8")}
                                                    </div>
                                                    <div className="text-order">
                                                        {item.price} {item.currency}
                                                    </div>
                                                </div>

                                                <div className="info-order">
                                                    <div className="label-order">
                                                        {t("info3")}
                                                    </div>
                                                    <div className="text-order">
                                                        {item.number_cars}
                                                    </div>
                                                </div>

                                                <div className="info-order">
                                                    <div className="label-order">
                                                        {t("info4")}
                                                    </div>
                                                    <div className="text-order">
                                                        {item.capacity} {item.unit}
                                                    </div>
                                                </div>

                                                <div className="info-order">
                                                    <div className="label-order">
                                                        {t("info5")}
                                                    </div>
                                                    <div className="text-order">
                                                        {item.car_category.min_weight ? item.car_category.min_weight : ""}-
                                                        {item.car_category.max_weight ? item.car_category.max_weight : ""} {t("infoWaits4")},
                                                        {item.car_category.name === "Мини" && t("tariff1")}
                                                        {item.car_category.name === "Енгил" && t("tariff2")}
                                                        {item.car_category.name === "Ўрта" && t("tariff3")}
                                                        {item.car_category.name === "Оғир" && t("tariff4")}
                                                        {item.car_category.name === "Ўта оғир" && t("tariff5")}
                                                        {item.car_category.name === "Авто Ташувчи" && t("tariff6")}
                                                    </div>
                                                </div>

                                                <div className="info-order">
                                                    <div className="label-order">
                                                        {t("info6")}
                                                    </div>
                                                    <div className="text-order">
                                                        {i18next.language === "ru" ? item.car_body_type.name_ru ? item.car_body_type.name_ru : "" :
                                                            item.car_body_type.name ? item.car_body_type.name : ""}
                                                    </div>
                                                </div>

                                                <div className="info-order">
                                                    <div className="label-order">
                                                        {t("info9")}
                                                    </div>
                                                    <div className="text-order">
                                                        {item.avans} {item.currency}
                                                    </div>
                                                </div>

                                                <div className="info-order">
                                                    <div className="label-order">
                                                        {t("info10")}
                                                    </div>
                                                    <div className="text-order">
                                                        {item.payment_type}
                                                    </div>
                                                </div>

                                                <div className="info-order">
                                                    <div className="label-order">
                                                        {t("info11")}
                                                    </div>
                                                    <div className="text-order">
                                                        {item.wait_cost} {item.currency}
                                                    </div>
                                                </div>

                                                <div className="info-order">
                                                    <div className="label-order">
                                                        {t("info12")}
                                                    </div>
                                                    <div className="text-order">
                                                        {item.load_time ? <>
                                                            {item.load_time.slice(0, 10)},
                                                            {item.load_time.slice(11, 16)}
                                                        </> : ""}

                                                    </div>
                                                </div>

                                                <div className="info-order">
                                                    <div className="label-order">
                                                        {t("info13")}
                                                    </div>
                                                    <div className="text-order">
                                                        {item.start_time ? <>
                                                            {item.start_time.slice(0, 10)},
                                                            {item.start_time.slice(11, 16)}
                                                        </> : ""}
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                })
                            }

                        </div>
                    </> : ""
                }

                {
                    menuUser === "2" ? <>
                        <div className="title">
                            <div className="icon-item">
                                <img src="./images/received.png" alt=""/>
                            </div>
                            <div className="menu-name">{t("myMenu2")}</div>
                        </div>
                        <div className="orders-box">
                            {
                                ordersList.map((item, index) => {
                                    if (item.status === "Delivering") return <div key={index} className="order">
                                        <div className="left-side-order">
                                            <div className="title-order">
                                                <div className="d-flex">
                                                    <div className="circle"></div>
                                                    {t("cargoLabel2")}
                                                </div>
                                                <div className="number">
                                                    <div className="name">
                                                        <img src="./images/Cardboard_Box2.png" alt=""/>
                                                        {t("numCargo")}
                                                    </div>
                                                    {item.id}
                                                </div>
                                            </div>

                                            <div className="date-order">
                                                <div className="title-date">{t("timeCargo1")}</div>
                                                {item.ordered_time.slice(0, 10)},
                                                {item.ordered_time.slice(11, 16)}
                                            </div>

                                            <div className="location-box">
                                                <div className="icon-location">
                                                    <img src="./images/location-pin2.png" alt=""/>
                                                </div>
                                                <div className="text-location">
                                                    {item.address_from}
                                                </div>
                                            </div>

                                            <div className="location-box">
                                                <div className="icon-location">
                                                    <img src="./images/location-pin3.png" alt=""/>
                                                </div>
                                                <div className="text-location">
                                                    {item.address_to}
                                                </div>
                                            </div>

                                            <div onClick={() => {
                                                setCargoId(item.id);
                                                setCancelOrder(true);
                                            }} className="cancel-btn">
                                                {t("button3")}
                                                <img src="./images/close.png" alt=""/>
                                            </div>

                                        </div>

                                        <div className="right-side-order">
                                            <div className="title-orders">{t("moreInfo")}</div>
                                            <div className="info-order">
                                                <div className="label-order">
                                                    {t("info1")}
                                                </div>
                                                <div className="text-order">
                                                    {item.type === "OUT" ? t("direction2") : ""}
                                                    {item.type === "IN" ? t("direction3") : ""}
                                                    {item.type === "Abroad" ? t("direction1") : ""}
                                                </div>
                                            </div>

                                            <div className="info-order">
                                                <div className="label-order">
                                                    {t("info2")}
                                                </div>
                                                <div className="text-order">
                                                    {item.cargo}
                                                </div>
                                            </div>

                                            <div className="info-order">
                                                <div className="label-order">
                                                    {t("info7")}
                                                </div>
                                                <div className="text-order">
                                                    {item.distance} km
                                                </div>
                                            </div>

                                            <div className="info-order">
                                                <div className="label-order">
                                                    {t("info8")}
                                                </div>
                                                <div className="text-order">
                                                    {item.price} {item.currency}
                                                </div>
                                            </div>

                                            <div className="info-order">
                                                <div className="label-order">
                                                    {t("info3")}
                                                </div>
                                                <div className="text-order">
                                                    {item.number_cars}
                                                </div>
                                            </div>

                                            <div className="info-order">
                                                <div className="label-order">
                                                    {t("info4")}
                                                </div>
                                                <div className="text-order">
                                                    {item.capacity} {item.unit}
                                                </div>
                                            </div>

                                            <div className="info-order">
                                                <div className="label-order">
                                                    {t("info5")}
                                                </div>
                                                <div className="text-order">
                                                    {item.car_category.min_weight ? item.car_category.min_weight : ""}-
                                                    {item.car_category.max_weight ? item.car_category.max_weight : ""} {t("infoWaits4")},
                                                    {item.car_category.name === "Мини" && t("tariff1")}
                                                    {item.car_category.name === "Енгил" && t("tariff2")}
                                                    {item.car_category.name === "Ўрта" && t("tariff3")}
                                                    {item.car_category.name === "Оғир" && t("tariff4")}
                                                    {item.car_category.name === "Ўта оғир" && t("tariff5")}
                                                    {item.car_category.name === "Авто Ташувчи" && t("tariff6")}
                                                </div>
                                            </div>

                                            <div className="info-order">
                                                <div className="label-order">
                                                    {t("info6")}
                                                </div>
                                                <div className="text-order">
                                                    {i18next.language === "ru" ? item.car_body_type.name_ru ? item.car_body_type.name_ru : "" :
                                                        item.car_body_type.name ? item.car_body_type.name : ""}
                                                </div>
                                            </div>

                                            <div className="info-order">
                                                <div className="label-order">
                                                    {t("info9")}
                                                </div>
                                                <div className="text-order">
                                                    {item.avans} {item.currency}
                                                </div>
                                            </div>

                                            <div className="info-order">
                                                <div className="label-order">
                                                    {t("info10")}
                                                </div>
                                                <div className="text-order">
                                                    {item.payment_type}
                                                </div>
                                            </div>

                                            <div className="info-order">
                                                <div className="label-order">
                                                    {t("info11")}
                                                </div>
                                                <div className="text-order">
                                                    {item.wait_cost} {item.currency}
                                                </div>
                                            </div>

                                            <div className="info-order">
                                                <div className="label-order">
                                                    {t("info12")}
                                                </div>
                                                <div className="text-order">
                                                    {item.load_time ? <>
                                                        {item.load_time.slice(0, 10)},
                                                        {item.load_time.slice(11, 16)}
                                                    </> : ""}

                                                </div>
                                            </div>

                                            <div className="info-order">
                                                <div className="label-order">
                                                    {t("info13")}
                                                </div>
                                                <div className="text-order">
                                                    {item.start_time ? <>
                                                        {item.start_time.slice(0, 10)},
                                                        {item.start_time.slice(11, 16)}
                                                    </> : ""}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                })
                            }

                        </div>
                    </> : ""
                }

                {
                    menuUser === "3" ? <>
                        <div className="title">
                            <div className="icon-item">
                                <img src="./images/order-cancel.png" alt=""/>
                            </div>
                            <div className="menu-name">{t("myMenu4")}</div>
                        </div>
                        <div className="orders-box">
                            {
                                ordersList.map((item, index) => {
                                    if (item.status === "Rejected") return <div key={index} className="order">
                                        <div className="left-side-order">
                                            <div className="title-order3">
                                                <div className="d-flex">
                                                    <div className="circle"></div>
                                                    {t("cargoLabel4")}
                                                </div>
                                                <div className="number">
                                                    <div className="name">
                                                        <img src="./images/Cardboard_Box2.png" alt=""/>
                                                        {t("numCargo")}
                                                    </div>
                                                    {item.id}
                                                </div>
                                            </div>

                                            <div className="date-order">
                                                <div className="title-date">{t("timeCargo1")}</div>
                                                {item.ordered_time.slice(0, 10)},
                                                {item.ordered_time.slice(11, 16)}
                                            </div>

                                            <div className="location-box">
                                                <div className="icon-location">
                                                    <img src="./images/location-pin2.png" alt=""/>
                                                </div>
                                                <div className="text-location">
                                                    {item.address_from}
                                                </div>
                                            </div>

                                            <div className="location-box">
                                                <div className="icon-location">
                                                    <img src="./images/location-pin3.png" alt=""/>
                                                </div>
                                                <div className="text-location">
                                                    {item.address_to}
                                                </div>
                                            </div>

                                            <div className="rejected-reason">
                                                {t("reason")}
                                                <div> {item.rejected_reason ? item.rejected_reason : ""}</div>
                                            </div>

                                        </div>

                                        <div className="right-side-order">
                                            <div className="title-orders">{t("moreInfo")}</div>
                                            <div className="info-order">
                                                <div className="label-order">
                                                    {t("info1")}
                                                </div>
                                                <div className="text-order">
                                                    {item.type === "OUT" ? t("direction2") : ""}
                                                    {item.type === "IN" ? t("direction3") : ""}
                                                    {item.type === "Abroad" ? t("direction1") : ""}
                                                </div>
                                            </div>

                                            <div className="info-order">
                                                <div className="label-order">
                                                    {t("info2")}
                                                </div>
                                                <div className="text-order">
                                                    {item.cargo}
                                                </div>
                                            </div>

                                            <div className="info-order">
                                                <div className="label-order">
                                                    {t("info7")}
                                                </div>
                                                <div className="text-order">
                                                    {item.distance} km
                                                </div>
                                            </div>

                                            <div className="info-order">
                                                <div className="label-order">
                                                    {t("info8")}
                                                </div>
                                                <div className="text-order">
                                                    {item.price} {item.currency}
                                                </div>
                                            </div>

                                            <div className="info-order">
                                                <div className="label-order">
                                                    {t("info3")}
                                                </div>
                                                <div className="text-order">
                                                    {item.number_cars}
                                                </div>
                                            </div>

                                            <div className="info-order">
                                                <div className="label-order">
                                                    {t("info4")}
                                                </div>
                                                <div className="text-order">
                                                    {item.capacity} {item.unit}
                                                </div>
                                            </div>

                                            <div className="info-order">
                                                <div className="label-order">
                                                    {t("info5")}
                                                </div>
                                                <div className="text-order">
                                                    {item.car_category.min_weight ? item.car_category.min_weight : ""}-
                                                    {item.car_category.max_weight ? item.car_category.max_weight : ""} {t("infoWaits4")},
                                                    {item.car_category.name === "Мини" && t("tariff1")}
                                                    {item.car_category.name === "Енгил" && t("tariff2")}
                                                    {item.car_category.name === "Ўрта" && t("tariff3")}
                                                    {item.car_category.name === "Оғир" && t("tariff4")}
                                                    {item.car_category.name === "Ўта оғир" && t("tariff5")}
                                                    {item.car_category.name === "Авто Ташувчи" && t("tariff6")}
                                                </div>
                                            </div>

                                            <div className="info-order">
                                                <div className="label-order">
                                                    {t("info6")}
                                                </div>
                                                <div className="text-order">
                                                    {i18next.language === "ru" ? item.car_body_type.name_ru ? item.car_body_type.name_ru : "" :
                                                        item.car_body_type.name ? item.car_body_type.name : ""}
                                                </div>
                                            </div>

                                            <div className="info-order">
                                                <div className="label-order">
                                                    {t("info9")}
                                                </div>
                                                <div className="text-order">
                                                    {item.avans} {item.currency}
                                                </div>
                                            </div>

                                            <div className="info-order">
                                                <div className="label-order">
                                                    {t("info10")}
                                                </div>
                                                <div className="text-order">
                                                    {item.payment_type}
                                                </div>
                                            </div>

                                            <div className="info-order">
                                                <div className="label-order">
                                                    {t("info11")}
                                                </div>
                                                <div className="text-order">
                                                    {item.wait_cost} {item.currency}
                                                </div>
                                            </div>

                                            <div className="info-order">
                                                <div className="label-order">
                                                    {t("info12")}
                                                </div>
                                                <div className="text-order">
                                                    {item.load_time ? <>
                                                        {item.load_time.slice(0, 10)},
                                                        {item.load_time.slice(11, 16)}
                                                    </> : ""}

                                                </div>
                                            </div>

                                            <div className="info-order">
                                                <div className="label-order">
                                                    {t("info13")}
                                                </div>
                                                <div className="text-order">
                                                    {item.start_time ? <>
                                                        {item.start_time.slice(0, 10)},
                                                        {item.start_time.slice(11, 16)}
                                                    </> : ""}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                })
                            }

                        </div>
                    </> : ""
                }

                {
                    menuUser === "4" ? <>
                        <div className="title">
                            <div className="icon-item">
                                <img src="./images/notification.png" alt=""/>
                            </div>
                            <div className="menu-name">Yangiliklar</div>
                        </div>
                        <div className="news-box">
                            {
                                newsList.map((item, index) => {
                                    return <div key={index} className="news">
                                        <div className="left">
                                            <img src={item.image} alt=""/>
                                        </div>
                                        <div className="right">
                                            {i18next.language === "ru" ? item.description_ru :
                                                item.description}

                                        </div>
                                    </div>
                                })
                            }
                        </div>
                    </> : ""
                }

                {
                    menuUser === "5" ? <>
                        <div className="title">
                            <div className="icon-item">
                                <img src="./images/shopping.png" alt=""/>
                            </div>
                            <div className="menu-name">{t("myMenu3")}</div>
                        </div>
                        <div className="orders-box">
                            {
                                ordersList.map((item, index) => {
                                    if (item.status === "Delivered") return <div key={index} className="order">
                                        <div className="left-side-order">
                                            <div className="title-order4">
                                                <div className="d-flex">
                                                    <div className="circle"></div>
                                                    {t("cargoLabel3")}
                                                </div>
                                                <div className="number">
                                                    <div className="name">
                                                        <img src="./images/Cardboard_Box2.png" alt=""/>
                                                        {t("numCargo")}
                                                    </div>
                                                    {item.id}
                                                </div>
                                            </div>

                                            <div className="date-order">
                                                <div className="title-date">{t("timeCargo1")}</div>
                                                {item.ordered_time.slice(0, 10)},
                                                {item.ordered_time.slice(11, 16)}
                                            </div>

                                            <div className="date-order">
                                                <div className="title-date">{t("timeCargo2")}</div>
                                                {item.ordered_time.slice(0, 10)},
                                                {item.ordered_time.slice(11, 16)}
                                            </div>

                                            <div className="location-box">
                                                <div className="icon-location">
                                                    <img src="./images/location-pin2.png" alt=""/>
                                                </div>
                                                <div className="text-location">
                                                    {item.address_from}
                                                </div>
                                            </div>

                                            <div className="location-box">
                                                <div className="icon-location">
                                                    <img src="./images/location-pin3.png" alt=""/>
                                                </div>
                                                <div className="text-location">
                                                    {item.address_to}
                                                </div>
                                            </div>

                                        </div>

                                        <div className="right-side-order">
                                            <div className="title-orders">{t("moreInfo")}</div>
                                            <div className="info-order">
                                                <div className="label-order">
                                                    {t("info1")}
                                                </div>
                                                <div className="text-order">
                                                    {item.type === "OUT" ? t("direction2") : ""}
                                                    {item.type === "IN" ? t("direction3") : ""}
                                                    {item.type === "Abroad" ? t("direction1") : ""}
                                                </div>
                                            </div>

                                            <div className="info-order">
                                                <div className="label-order">
                                                    {t("info2")}
                                                </div>
                                                <div className="text-order">
                                                    {item.cargo}
                                                </div>
                                            </div>

                                            <div className="info-order">
                                                <div className="label-order">
                                                    {t("info7")}
                                                </div>
                                                <div className="text-order">
                                                    {item.distance} km
                                                </div>
                                            </div>

                                            <div className="info-order">
                                                <div className="label-order">
                                                    {t("info8")}
                                                </div>
                                                <div className="text-order">
                                                    {item.price} {item.currency}
                                                </div>
                                            </div>

                                            <div className="info-order">
                                                <div className="label-order">
                                                    {t("info3")}
                                                </div>
                                                <div className="text-order">
                                                    {item.number_cars}
                                                </div>
                                            </div>

                                            <div className="info-order">
                                                <div className="label-order">
                                                    {t("info4")}
                                                </div>
                                                <div className="text-order">
                                                    {item.capacity} {item.unit}
                                                </div>
                                            </div>

                                            <div className="info-order">
                                                <div className="label-order">
                                                    {t("info5")}
                                                </div>
                                                <div className="text-order">
                                                    {item.car_category.min_weight ? item.car_category.min_weight : ""}-
                                                    {item.car_category.max_weight ? item.car_category.max_weight : ""} {t("infoWaits4")},
                                                    {item.car_category.name === "Мини" && t("tariff1")}
                                                    {item.car_category.name === "Енгил" && t("tariff2")}
                                                    {item.car_category.name === "Ўрта" && t("tariff3")}
                                                    {item.car_category.name === "Оғир" && t("tariff4")}
                                                    {item.car_category.name === "Ўта оғир" && t("tariff5")}
                                                    {item.car_category.name === "Авто Ташувчи" && t("tariff6")}
                                                </div>
                                            </div>

                                            <div className="info-order">
                                                <div className="label-order">
                                                    {t("info6")}
                                                </div>
                                                <div className="text-order">
                                                    {i18next.language === "ru" ? item.car_body_type.name_ru ? item.car_body_type.name_ru : "" :
                                                        item.car_body_type.name ? item.car_body_type.name : ""}
                                                </div>
                                            </div>

                                            <div className="info-order">
                                                <div className="label-order">
                                                    {t("info9")}
                                                </div>
                                                <div className="text-order">
                                                    {item.avans} {item.currency}
                                                </div>
                                            </div>

                                            <div className="info-order">
                                                <div className="label-order">
                                                    {t("info10")}
                                                </div>
                                                <div className="text-order">
                                                    {item.payment_type}
                                                </div>
                                            </div>

                                            <div className="info-order">
                                                <div className="label-order">
                                                    {t("info11")}
                                                </div>
                                                <div className="text-order">
                                                    {item.wait_cost} {item.currency}
                                                </div>
                                            </div>

                                            <div className="info-order">
                                                <div className="label-order">
                                                    {t("info12")}
                                                </div>
                                                <div className="text-order">
                                                    {item.load_time ? <>
                                                        {item.load_time.slice(0, 10)},
                                                        {item.load_time.slice(11, 16)}
                                                    </> : ""}

                                                </div>
                                            </div>

                                            <div className="info-order">
                                                <div className="label-order">
                                                    {t("info13")}
                                                </div>
                                                <div className="text-order">
                                                    {item.start_time ? <>
                                                        {item.start_time.slice(0, 10)},
                                                        {item.start_time.slice(11, 16)}
                                                    </> : ""}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                })
                            }

                        </div>
                    </> : ""
                }
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
};

export default MyProfile