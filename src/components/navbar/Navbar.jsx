import {useContext, useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {Dropdown} from "react-bootstrap";
import i18next from "i18next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./navbar.scss"
import axios from "axios";
import {MyContext} from "../app/App";
import {CSSTransition} from "react-transition-group";

const Navbar = () => {
    let value = useContext(MyContext);
    const [nav, setNav] = useState(false);
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [user, setUser] = useState([]);
    const [alertCancel, setAlertCancel] = useState(false);
    const nodeRef = useRef(null);
    const menu = [
        {
            name: t('home'),
            link: "/"
        },
        {
            name: t('agreement'),
            link: "/agreement"
        },
        {
            name: t('about-app'),
            link: "/about-app"
        },
        {
            name: t('post-order'),
            link: "/post-order"
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
                setUser(response.data)
            }).catch((error) => {
                if (error.response.statusText == "Unauthorized") {
                    window.location.pathname = "/login-client";
                    localStorage.removeItem("token");
                }
            });
        }

    }, []);


    return <nav className="navbar-container">

        <CSSTransition
            in={alertCancel}
            nodeRef={nodeRef}
            timeout={300}
            classNames="alert"
            unmountOnExit
        >
            <div ref={nodeRef} className="alert-cancel">
                <div className="img-box">
                    <img src="./images/caution2.png" alt=""/>
                </div>
                <div className="text-box">
                    Buyurtma berish uchun ro'yxatdan o'tishingizni so'raymiz!
                </div>
                <div onClick={() => setAlertCancel(false)} className="close">
                    <img src="./images/close-driver-list.png" alt=""/>
                </div>
            </div>

        </CSSTransition>

        <div className="logo">
            <img onClick={() => {
                navigate('/')
            }} src="./images/logo1.png" alt=""/>
        </div>

        <div className={`nav-list ${!nav ? "hide" : ""}`}>
            {
                menu.map((item, index) => {
                    return <div key={index} onClick={() => {

                        if (item.link === "/post-order") {

                            if (localStorage.getItem("userId")) {
                                navigate(item.link)
                            } else {
                                setAlertCancel(true);
                                setNav(false)
                                setTimeout(() => {
                                    setAlertCancel(false);
                                }, 5000)
                            }

                        } else navigate(item.link);

                    }} className={`nav-item`}>{item.name}</div>
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


        {
            localStorage.getItem("userId") ? <div className="user-profile">
                <Dropdown>
                    <Dropdown.Toggle variant="none" id="dropdown-basic">
                        <img className="security-icon" src="./images/profile.png" alt=""/>
                        <div className="Name">
                            {user.first_name}
                        </div>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => {
                            navigate('/my-profile')
                        }}>
                            Profilim
                        </Dropdown.Item>

                        <Dropdown.Item onClick={() => {
                            window.location.pathname = "/";
                            localStorage.removeItem("token");
                            localStorage.removeItem("userId");
                            window.location.pathname = "/";
                        }}>
                            Chiqish
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div> : <div onClick={() => navigate('/login-client')} className="login-btn">
                Kirish
            </div>
        }

        <div className="nav-show">
            {
                nav ? <img onClick={() => setNav(false)} src="./images/close.png" alt=""/> :
                    <img onClick={() => setNav(true)} src="./images/menu.png" alt=""/>
            }
        </div>

    </nav>
};

export default Navbar