import {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {Dropdown} from "react-bootstrap";
import i18next from "i18next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./navbar.scss"
import axios from "axios";
import {MyContext} from "../app/App";

const Navbar = () => {
    let value = useContext(MyContext);
    const [nav, setNav] = useState(false);
    const navigate = useNavigate();
    const {t} = useTranslation();
    const menu = [
        {
            name: t('home'),
            link: "/"
        },
        {
            name: t('about-app'),
            link: "/about-app"
        },
        {
            name: t('agreement'),
            link: "/agreement"
        },
        {
            name: t('contact'),
            link: "/contact"
        }
    ];

    const language = [
        {
            code: 'uz',
            name: 'UZ',
            country_code: 'uz'
        },
        // {
        //     code: 'uzb',
        //     name: 'ЎЗБ',
        //     country_code: 'uzb'
        // },
        {
            code: 'en',
            name: 'EN',
            country_code: 'en'
        },
        {
            code: 'ru',
            name: 'RU',
            country_code: 'ru'
        }
    ];

    useEffect(() => {
        if (localStorage.getItem("token")) {
            axios.get(`${value.url}api/client/`, {
                headers: {
                    "Authorization": `Token ${localStorage.getItem("token")}`
                }
            }).then((response) => {
                localStorage.setItem("user_name",response.data.first_name)
            }).catch((error) => {
                if (error.response.statusText == "Unauthorized") {
                    window.location.pathname = "/login-client";
                    localStorage.removeItem("token");
                    localStorage.removeItem("userId");
                    localStorage.removeItem("user_name");

                }
            });
        }
    }, []);


    return <nav className="navbar-container">

        <div className="logo">
            <img onClick={() => {
                navigate('/')
            }} src="./images/logo1.png" alt=""/>
        </div>

        <div className={`nav-list ${!nav ? "hide" : ""}`}>

            <div onClick={() => { }} className={`nav-item-hide`}>
                <img onClick={() => setNav(false)} src="./images/close.png" alt=""/>
            </div>

            {
                menu.map((item, index) => {
                    return <div key={index} onClick={() => navigate(item.link)} className={`nav-item`}>{item.name}</div>
                })
            }
        </div>

        <div className='language-box'>
            <Dropdown>
                <Dropdown.Toggle variant="light" className='text-dark' id="dropdown-basic">
                    {language.map((item, index) => {
                        return <div key={index}>
                            {i18next.language === item.code ? item.name : ""}
                        </div>
                    })}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {
                        language.map(({code, name, country_code}) => (
                            <li key={country_code}>
                                <div onClick={() => {
                                    window.location.reload();
                                    i18next.changeLanguage(code);
                                    localStorage.setItem("lng", code);
                                    if (code === "uz") localStorage.setItem("language", "uz");
                                    if (code === "ru") localStorage.setItem("language", "ru");
                                    if (code === "en") localStorage.setItem("language", "en")
                                }} className='d-flex '>
                                    <Dropdown.Item>
                                        {name}
                                    </Dropdown.Item>
                                </div>
                            </li>
                        ))
                    }
                </Dropdown.Menu>
            </Dropdown>
        </div>

        <a  href="https://client.buyukyol.uz/" target="_blank" className="login-btn">
            {t("post-order")}
        </a>

        <div className="nav-show">
            <img onClick={() => setNav(true)} src="./images/menu.png" alt=""/>
        </div>

    </nav>
};

export default Navbar