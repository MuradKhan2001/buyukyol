import "./footer.scss"
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useContext, useEffect, useState} from "react";
import {MyContext} from "../app/App";
import axios from "axios";
import i18next from "i18next";


const Footer = () => {
    let value = useContext(MyContext);
    const [MainList, setMainList] = useState([]);
    const navigate = useNavigate();
    const {t} = useTranslation();

    const menu = [
        {
            id: 1,
            name: t('home'),
            link: "/"
        },
        {
            id: 2,
            name: t('service'),
            link: "/service"
        },
        {
            id: 3,
            name: t('agreement'),
            link: "/agreement"
        },
        {
            id: 4,
            name: t('about'),
            link: "/about-us"
        },
        {
            id: 5,
            name: t('contact'),
            link: "/contact"
        }
    ];

    useEffect(() => {
        axios.get(`${value.url}dashboard/contact/`, {
            headers: {
                "Accept-Language": i18next.language ? i18next.language : "uz"
            }
        }).then((response) => {
            setMainList(response.data);
        }).catch((error) => {
            if (error.response.statusText == "Unauthorized") {
                window.location.pathname = "/";
                localStorage.removeItem("token");
            }
        });

    }, []);


    return <div className="footer-wrapper">
        <div className="sloy-footer ">
            <div className="box-footer container">

                <div className="box1">
                    <div onClick={()=>{
                        navigate('/')
                    }} className="logo">
                        <img src="./images/logo1.png" alt=""/>
                    </div>
                </div>

                <div className="box2">
                    <div className="title">
                        {t('menu')}
                    </div>
                    {
                        menu.map((item)=>{
                            return <div key={item.id} onClick={()=>{
                                navigate(item.link)
                            }} className="menu-items">{item.name}</div>
                        })
                    }
                </div>

                {
                    MainList.map((item,index)=>{
                        return  <div  key={index} className="box3">
                            <div className="title">{t('contact')}</div>

                            <div className="menu-items">
                                <div className="icon">
                                    <img src="./images/phone-call.png" alt=""/>
                                </div>

                                <a href={`tel:${item.phone1}`} className="name">
                                    {item.phone1}
                                </a>
                            </div>

                            <div className="menu-items">
                                <div className="icon">
                                    <img src="./images/phone-call.png" alt=""/>
                                </div>

                                <a href={`tel:${item.phone2}`} className="name">
                                    {item.phone2}
                                </a>
                            </div>

                            <div className="menu-items">
                                <div className="icon">
                                    <img src="./images/telegram.png" alt=""/>
                                </div>
                                <a href={item.telegram} target="_blank" className="name">
                                    buyukyol
                                </a>
                            </div>

                            <div className="menu-items">
                                <div className="icon">
                                    <img src="./images/instagram.png" alt=""/>
                                </div>
                                <a href={item.instagram} target="_blank" className="name">
                                   buyukyol
                                </a>
                            </div>

                            <div className="menu-items">
                                <div className="icon">
                                    <img src="./images/facebook.png" alt=""/>
                                </div>
                                <a href={item.facebook} target="_blank" className="name">
                                   buyukyol
                                </a>
                            </div>

                        </div>
                    })
                }

                {MainList.map((item,index)=>{
                    return <div key={index} className="box4">
                        <div className="location">
                            <div className="icon">
                                <img src="./images/gps.png" alt=""/>
                            </div>
                            <div className="name">
                                {item.address}
                            </div>
                        </div>
                    </div>
                })}

            </div>
        </div>
    </div>
};

export default Footer;