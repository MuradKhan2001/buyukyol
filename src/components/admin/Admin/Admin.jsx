import {useState, useEffect, useContext} from "react";
import {useNavigate, Route, Routes, NavLink} from "react-router-dom";
import "./admin.scss"
import {adminPageRoutes} from "../../routes/Routes";
import i18next from "i18next";
import {useTranslation} from "react-i18next";
import axios from "axios";
import {MyContext} from "../../app/App";


const Admin = () => {

    let value = useContext(MyContext);
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [StatisticsCount, setStatisticsCount] = useState([]);


    const AppMenus = [
        {
            name: t('nav1'),
            url: "/",
            img: "../images/admin/home.png"
        },
        {
            name: t('nav2'),
            url: "/balance",
            img: "../images/admin/money.png"
        },
        {
            name: t('nav3'),
            url: "/orders",
            img: "../images/admin/shopping.png"
        },
        {
            name: t('nav4'),
            url: "/driver",
            img: "../images/admin/driver.png"
        },
        {
            name: t('nav5'),
            url: "/customer",
            img: "../images/admin/rating.png"
        },
        {
            name: t('nav6'),
            url: "/direction",
            img: "../images/admin/flexibility.png"
        },
        {
            name: t('nav13'),
            url: "/price",
            img: "../images/admin/price-tag.png"
        },
        {
            name: t('nav7'),
            url: "/payment",
            img: "../images/admin/payment.png"
        },
        {
            name: t('nav8'),
            url: "/addcar",
            img: "../images/admin/add.png"
        },
        {
            name: t('nav9'),
            url: "/addbag",
            img: "../images/admin/truck.png"
        },
        {
            name: t('nav10'),
            url: "/notification",
            img: "../images/admin/notification.png"
        },
        {
            name: t('nav11'),
            url: "/partners",
            img: "../images/admin/handshake.png"
        },
        {
            name: t('nav12'),
            url: "/safety",
            img: "../images/admin/lock.png"
        },

    ];

    const SiteMenus = [
        {
            name: t('about'),
            url: "/aboutus",
            img: "../images/admin/about.png"
        },
        {
            name: t('contact'),
            url: "/contacta",
            img: "../images/admin/contact-us.png"
        },
        {
            name: t('news'),
            url: "/news",
            img: "../images/admin/news.png"
        },
        {
            name: t('service'),
            url: "/servicea",
            img: "../images/admin/customer.png"
        },
        {
            name: t('partners'),
            url: "/partnersa",
            img: "../images/admin/handshake.png"
        },
        {
            name: t('galary'),
            url: "/moments",
            img: "../images/admin/image.png"
        },
        {
            name: t('agreement'),
            url: "/contract",
            img: "../images/admin/agreement.png"
        }
    ];

    useEffect(() => {
        axios.get(`${value.url}dashboard/home/`, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then((response) => {
            setStatisticsCount(response.data)
        }).catch((error) => {
            if (error.response.statusText == "Unauthorized") {
                window.location.pathname = "/";
                localStorage.removeItem("token");
            }
        });

        if (sessionStorage.getItem("menu")) {
        } else sessionStorage.setItem("menu", "1");

    }, []);

    const Statistics = [
        {
            name: t('count1'),
            count: StatisticsCount.balance
        },
        {
            name: t('count2'),
            count: StatisticsCount.driver
        },
        {
            name: t('count3'),
            count: StatisticsCount.client
        },
        {
            name: t('count4'),
            count: StatisticsCount.sponsor
        }
    ];


    return <div className="admin-home">
        <div className="left-box">
            <div className="logo">
                <img onClick={() => navigate('/')} src="../images/logo4.png" alt=""/>
            </div>

            <div className="line"></div>

            <div className="header">
                <div onClick={() => {
                   sessionStorage.setItem("menu","1");
                    navigate('/')
                }} className={`item ${sessionStorage.getItem("menu") === "1" ? "active" : ""}`}>App
                </div>
                <div onClick={() => {
                    sessionStorage.setItem("menu","2");
                    navigate('/aboutus')
                }} className={`item ${sessionStorage.getItem("menu") === "2" ? "active" : ""}`}>Site
                </div>
            </div>

            {
                sessionStorage.getItem('menu') === "1" ?
                    <div className="admin-navbar">
                        {
                            AppMenus.map((item, index) => {
                                return <NavLink to={item.url} key={index}
                                                className={`nav-item ${({isActive}) => isActive ? "active" : ""}`}>
                                    <img src={item.img} alt=""/>
                                    {item.name}
                                </NavLink>
                            })
                        }
                    </div>
                    :
                    <div className="admin-navbar">
                        {
                            SiteMenus.map((item, index) => {
                                return <NavLink to={item.url} key={index}
                                                className={`nav-item ${({isActive}) => isActive ? "active" : ""}`}>
                                    <img src={item.img} alt=""/>
                                    {item.name}
                                </NavLink>
                            })
                        }
                    </div>
            }

        </div>
        <div className="right-box">
            <div className="top-box">
                <div className="statistic-box">
                    {Statistics.map((item, index) => {
                        return <div key={index} className="statistic-item">
                            <div className="title">{item.name}</div>
                            <div className="count">{item.count}</div>
                        </div>
                    })}

                </div>

                <div className="icons">
                    <div className="language-box">

                        <div onClick={() => {
                            i18next.changeLanguage('uz');
                            localStorage.setItem("lng", "uz")
                        }} className={`lng-item ${i18next.language === "uz" ? "active" : ""}`}>UZ
                        </div>

                        <div onClick={() => {
                            i18next.changeLanguage('ru');
                            localStorage.setItem("lng", "ru")
                        }} className={`lng-item ${i18next.language === "ru" ? "active" : ""}`}>RU
                        </div>
                    </div>
                    <div onClick={() => {
                        localStorage.removeItem('token');
                        window.location.pathname = "/";
                        localStorage.setItem("lng", "uz")
                        sessionStorage.removeItem("menu")
                    }} className="exit"><img src="./images/logout.png" alt=""/></div>
                </div>
            </div>
            <div className="bottom-box">
                <Routes>
                    {
                        adminPageRoutes.map((route, index) => (
                            <Route key={index} {...route} />
                        ))
                    }
                </Routes>
            </div>
        </div>
    </div>
};

export default Admin