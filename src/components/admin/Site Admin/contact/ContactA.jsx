import "./style.scss"
import {useContext, useEffect, useState} from "react";
import {MyContext} from "../../../app/App";
import axios from "axios";

const ContactA = () => {
    let value = useContext(MyContext);
    const [MainList, setMainList] = useState([]);
    const [listInfo, setListInfo] = useState({
        phone1: "",
        phone2: "",
        telegram: "",
        instagram: "",
        youtube: "",
        facebook: ""
    });
    const [adressUz, setAdressUz] = useState("");
    const [adressUzb, setAdressUzb] = useState("");
    const [adressRu, setAdressRu] = useState("");
    const [adressEn, setAdressEn] = useState("");

    const getInputs = (e) => {
        listInfo[e.target.name] = e.target.value;
    };

    const getList = (lng) => {
        axios.get(`${value.url}dashboard/contact/`, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`,
                "Accept-Language": lng ? lng : "uz"
            }
        }).then((response) => {
            setMainList(response.data);
        }).catch((error) => {
            if (error.response.statusText == "Unauthorized") {
                window.location.pathname = "/";
                localStorage.removeItem("token");
            }
        });
    };

    useEffect(() => {
        getList();
    }, []);

    const pushInfo = () => {
        if (adressUz.trim().length > 0 && adressUzb.trim().length > 0 && adressRu.trim().length > 0 && adressEn.trim().length > 0&& listInfo.phone1.trim().length > 0 && listInfo.phone2.trim().length > 0 &&
            listInfo.telegram.trim().length > 0 && listInfo.instagram.trim().length > 0 && listInfo.youtube.trim().length > 0
            && listInfo.facebook.trim().length > 0) {

            const mainListInfo = {
                phone1: listInfo.phone1,
                phone2: listInfo.phone2,
                telegram: listInfo.telegram,
                instagram: listInfo.instagram,
                youtube: listInfo.youtube,
                facebook: listInfo.facebook,
                translations: {
                    en: {
                        address: adressEn
                    },
                    ru: {
                        address: adressRu
                    },
                    uz: {
                        address: adressUz
                    },
                    ro: {
                        address: adressUzb
                    },
                },
            };

            axios.post(`${value.url}dashboard/contact/`, mainListInfo, {
                headers: {
                    "Authorization": `Token ${localStorage.getItem("token")}`
                }
            }).then(() => {

                getList();

                document.getElementById("phone1").value="";
                document.getElementById("phone2").value="";
                document.getElementById("telegram").value="";
                document.getElementById("instagram").value="";
                document.getElementById("youtube").value="";
                document.getElementById("facebook").value="";
                document.getElementById("adressUz").value="";
                document.getElementById("adressUzb").value="";
                document.getElementById("adressRu").value="";
                document.getElementById("adressEn").value="";

            }).catch(() => {

            });

        } else alert("Formani to'ldiring")

    };

    return <div className="admin-contact-box">
        <div className="header-side">
            <div className="filter-box">
                <div className="inputs">
                    <select name="partner" id="partner" onChange={(e) => {
                        getList(e.target.value)
                    }}>
                        <option value={"uz"}>UZ</option>
                        <option value={"ro"}>ЎЗБ</option>
                        <option value={"ru"}>RU</option>
                        <option value={"en"}>EN</option>
                    </select>
                </div>
            </div>
        </div>

        <div className="content-card">
            <div className="left">

                <div className="inputs">
                    <input id="phone1" onChange={getInputs} name="phone1" placeholder="Tel raqam" type="text"/>
                    <input id="phone2" onChange={getInputs} name="phone2" placeholder="Tel raqam" type="text"/>
                    <input id="telegram" onChange={getInputs} name="telegram" placeholder="Telegram" type="text"/>
                    <input id="instagram" onChange={getInputs} name="instagram" placeholder="Instagram" type="text"/>
                    <input id="youtube" onChange={getInputs} name="youtube" placeholder="Youtube" type="text"/>
                    <input id="facebook" onChange={getInputs} name="facebook" placeholder="Facebook" type="text"/>

                    <input id="adressUz" onChange={(e) => setAdressUz(e.target.value)} name="adressUz" placeholder="Manzil"
                           type="text"/>
                    <input id="adressUzb" onChange={(e) => setAdressUzb(e.target.value)} name="adressUzb" placeholder="Манзил"
                           type="text"/>
                    <input id="adressRu" onChange={(e) => setAdressRu(e.target.value)} name="adressRu" placeholder="Адрес"
                           type="text"/>
                    <input id="adressEn" onChange={(e) => setAdressEn(e.target.value)} name="adressEn" placeholder="Address"
                           type="text"/>

                    <div onClick={pushInfo} className="add-button">Qo'shish</div>
                </div>

            </div>

            <div className="right">
                <div className="cards">
                    {
                        MainList.map((item, index)=>{
                            return  <div key={index} className="for-text">
                                <div className="items">
                                    <div className="title">Birinchi raqam:</div>
                                    <div className="title-item">{item.phone1}</div>
                                </div>
                                <div className="items">
                                    <div className="title">Ikkinchi raqam:</div>
                                    <div className="title-item">{item.phone2}</div>
                                </div>
                                <div className="items">
                                    <div className="title">Telegram:</div>
                                    <div className="title-item">{item.telegram}</div>
                                </div>
                                <div className="items">
                                    <div className="title">Instagram:</div>
                                    <div className="title-item">{item.instagram}</div>
                                </div>
                                <div className="items">
                                    <div className="title">Facebook:</div>
                                    <div className="title-item">{item.facebook}</div>
                                </div>
                                <div className="items">
                                    <div className="title">Youtube:</div>
                                    <div className="title-item">{item.youtube}</div>
                                </div>
                                <div className="items">
                                    <div className="title">Manzil:</div>
                                    <div className="title-item">{item.address}</div>
                                </div>
                            </div>
                        })
                    }
                </div>

            </div>

        </div>
    </div>
};

export default ContactA