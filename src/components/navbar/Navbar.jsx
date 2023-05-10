import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {Dropdown} from "react-bootstrap";
import i18next from "i18next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./navbar.scss"

const Navbar = () => {

    const [nav, setNav] = useState(false);
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

    const language = [
        {
            code: 'uz',
            name: 'UZB',
            country_code: 'uz'
        },
        {
            code: 'uzb',
            name: 'ЎЗБ',
            country_code: 'uzb'
        },
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



    return <nav className="navbar-container container">
        <div className="logo">
            <img onClick={()=>{
                navigate('/login')
            }} src="./images/logo1.png" alt=""/>
        </div>
        <div className={`nav-list ${!nav ? "hide" : ""}`}>
            {
                menu.map((item) => {
                    return <div key={item.id} onClick={() => {
                        navigate(item.link)
                    }}  className={`nav-item`}>{item.name}</div>
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
                                    localStorage.setItem("lng", code)
                                    if (code === "uz") localStorage.setItem("language", "uz")
                                    if (code === "uzb") localStorage.setItem("language", "ro")
                                    if (code === "ru") localStorage.setItem("language", "ru")
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

        <div className="nav-show">
            {
                nav ? <img onClick={() => setNav(false)} src="./images/close.png" alt=""/> :
                    <img onClick={() => setNav(true)} src="./images/menu.png" alt=""/>
            }
        </div>

    </nav>
};

export default Navbar