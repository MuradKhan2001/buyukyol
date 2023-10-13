import {useContext, useState} from "react";
import "./Sendsms.scss";
import {MyContext} from "../../app/App";
import axios from "axios";

const Sendsms = () => {
    let value = useContext(MyContext);
    const [checkSuccess1, setCheckSuccess1] = useState(false);
    const [checkSuccess2, setCheckSuccess2] = useState(false);
    const [checkSuccess3, setCheckSuccess3] = useState(false);

    const sendMessageDriver1 = () => {

        const message = {
            text: 2,
            user: "driver",
            verified: false
        };

        axios.post(`${value.url}dashboard/sendsmsnotification/`, message, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then(() => {
            setCheckSuccess1(true);
        });

        setTimeout(() => {
            setCheckSuccess1(false);
        }, 3000)
    };

    const sendMessageDriver2 = () => {


        const message = {
            text: 3,
            user: "driver",
            verified: true
        };


        axios.post(`${value.url}dashboard/sendsmsnotification/`, message, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then(() => {
            setCheckSuccess2(true);
        });

        setTimeout(() => {
            setCheckSuccess2(false);
        }, 3000)
    };

    const sendMessageClient = () => {

        const message = {
            text: 4,
            user: "client"
        };

        axios.post(`${value.url}dashboard/sendsmsnotification/`, message, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then(() => {
            setCheckSuccess3(true);
        });

        setTimeout(() => {
            setCheckSuccess3(false);
        }, 3000)
    };


    return <div className="sms-container">
        <div className="content-card">

            <div className="left">
                <div className="title">Haydovchilar</div>

                <div className="massage-box">
                    <div className="inputs">
                        <div className="text-messages">
                            <div className="text-center">
                                Yuk kerakmi? Unda "Buyuk yo'l" ilovasini yuklab oling va doimiy yuklarga ega bo'ling.
                                Ma'lumot uchun: (95)5777971
                            </div>
                        </div>
                    </div>

                    <div className="xbtns">
                        <div onClick={sendMessageDriver1} className="add-button">
                            {
                                checkSuccess1 ? <div className="wrapper">
                                    <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                        <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                                        <path className="checkmark__check" fill="none"
                                              d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                                    </svg>
                                </div> : <span>Yuborish</span>
                            }

                        </div>
                    </div>
                </div>

                <div className="massage-box">
                    <div className="inputs">
                        <div className="text-messages">
                            <div className="text-center">
                                "Buyuk yo'l" ilovasidan yuklarni qabul qilish uchun to'liq ro'yxatdan o'tishingizni
                                so'raymiz. Ma'lumot uchun: (95)5777971
                            </div>
                        </div>
                    </div>

                    <div className="xbtns">
                        <div onClick={sendMessageDriver2} className="add-button">
                            {
                                checkSuccess2 ? <div className="wrapper">
                                    <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                        <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                                        <path className="checkmark__check" fill="none"
                                              d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                                    </svg>
                                </div> : <span>Yuborish</span>
                            }

                        </div>
                    </div>
                </div>

            </div>

            <div className="right">
                <div className="title">Mijozlar</div>

                <div className="massage-box">
                    <div className="inputs">
                        <div className="text-messages">
                            <div className="text-center">
                                Yukingizga avtomobil kerakmi? Unda "Buyuk yo'l" ilovasini yuklab oling va u orqali yuk
                                abtomobillarini tez, oson toping. Ma'lumot uchun: (95)5777971
                            </div>
                        </div>
                    </div>
                    <div className="xbtns">
                        <div onClick={sendMessageClient} className="add-button">
                            {
                                checkSuccess3 ? <div className="wrapper">
                                    <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                        <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                                        <path className="checkmark__check" fill="none"
                                              d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                                    </svg>
                                </div> : <span>Yuborish</span>
                            }

                        </div>
                    </div>
                </div>

            </div>

        </div>
    </div>
};

export default Sendsms