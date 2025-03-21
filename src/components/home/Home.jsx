import "./home.scss"
import Navbar from "../navbar/Navbar";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "../footer/footer";
import Aos from "aos";
import {useTranslation} from "react-i18next";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {MyContext} from "../app/App";
import {useNavigate} from "react-router-dom";


const Home = () => {
    let value = useContext(MyContext);
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [newsList, setNewsList] = useState([]);
    const [galary, setGalary] = useState([]);
    const [partners, setPartners] = useState([]);
    const [statistics, setStatistics] = useState({});
    const [MainList, setMainList] = useState([]);
    const [MainListService, setMainListService] = useState([]);
    const [sendBox, setSendBox] = useState({
        first_name: "",
        phone: "",
    });
    const [checkSuccess, setCheckSuccess] = useState(false);

    const settingsForStills = {
        dots: false,
        infinite: true,
        speed: 1000,
        autoplay: true,
        slidesToShow: 3,
        slidesToScroll: 3,
        initialSlide: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    const settingsForNews = {
        dots: false,
        infinite: true,
        speed: 1000,
        autoplay: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    useEffect(() => {

        axios.get(`${value.url}dashboard/aboutus/`, {
            headers: {
                "Accept-Language": localStorage.getItem('language') ? localStorage.getItem('language') : "uz"
            }
        }).then((response) => {
            setMainList(response.data);
        }).catch((error) => {
            if (error.response.statusText == "Unauthorized") {
                window.location.pathname = "/";
                localStorage.removeItem("token");
            }
        });

        axios.get(`${value.url}dashboard/services/`, {
            headers: {
                "Accept-Language": localStorage.getItem('language') ? localStorage.getItem('language') : "uz"
            }
        }).then((response) => {
            setMainListService(response.data);
        }).catch((error) => {
            if (error.response.statusText == "Unauthorized") {
                window.location.pathname = "/";
                localStorage.removeItem("token");
            }
        });

        axios.get(`${value.url}dashboard/news/`, {
            headers: {
                "Accept-Language": localStorage.getItem('language') ? localStorage.getItem('language') : "uz"
            }
        }).then((response) => {
            setNewsList(response.data);
        }).catch(() => {
        });

        axios.get(`${value.url}dashboard/galary/`).then((response) => {
            setGalary(response.data);
        }).catch((error) => {
            if (error.response.statusText == "Unauthorized") {
                window.location.pathname = "/";
                localStorage.removeItem("token");
            }
        });

        axios.get(`${value.url}dashboard/partner/`).then((response) => {
            setPartners(response.data);
        }).catch((error) => {
            if (error.response.statusText == "Unauthorized") {
                window.location.pathname = "/";
                localStorage.removeItem("token");
            }
        });

        axios.get(`${value.url}dashboard/statistics/`).then((response) => {
            setStatistics(response.data);
        }).catch((error) => {
            if (error.response.statusText == "Unauthorized") {
                window.location.pathname = "/";
                localStorage.removeItem("token");
            }
        });

        Aos.init({duration: 600});
    }, []);

    const getInputs = (e) => {
        sendBox[e.target.name] = e.target.value;
    };

    const handleSendMessage = () => {

        if (sendBox.first_name.trim().length > 0 && sendBox.phone.trim().length) {

            axios.post(`${value.url}dashboard/contactus/`, sendBox).then((response) => {

                setCheckSuccess(true);

                let newList = {
                    first_name: "",
                    phone: "",
                };

                setSendBox(newList);

                document.getElementById("first_name").value = "";
                document.getElementById("phone").value = "";

                setTimeout(() => {
                    setCheckSuccess(false);
                }, 3000)

            }).catch(() => {

            });

        } else alert("Formani toldiring");


    };


    return <div className="home-wrapper">

        <div className="home-page">
            <Navbar/>
            <div className={`home-content`}>
                <div className="home-section-one">
                    <p>"Buyuk yo'l"-{t("homeText2")}</p>
                    <span>"Buyuk yo’l"</span> {t("homeText")}
                </div>
                <div className="home-section-two">
                    <img src="./images/home-image.jpg" alt=""/>
                </div>
                <div className="home-section-three">
                    <div className="left-side">
                        <div className="button-box">
                            <a href="https://play.google.com/store/apps/details?id=uz.buyukyol.driver"
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

                            <a href="https://apps.apple.com/uz/app/buyuk-yol-haydovchi/id6479575262" target="_blank">
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
                    <div className="right-side">
                        <div className="stills">
                            <div className="content-box">
                                <Slider {...settingsForStills} >
                                    {
                                        galary.map((item, index) => {
                                            return <div key={index} className="click-slide-box">
                                                <div className="photo">
                                                    <a href={item.image} className="highslide"
                                                       onClick={() => (item.image)}>
                                                        <img
                                                            src={item.image}
                                                            alt=""/>
                                                    </a>

                                                </div>
                                            </div>
                                        })
                                    }
                                </Slider>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="section-wrapper">
            <div className="about-us-wrapper">
                {
                    MainList.map((item, index) => {
                        return <div key={index} className="content-box container">
                            <div className="left-side">
                                <div className="card-box"></div>
                                <div className="img-box">
                                    <img src={item.image} alt=""/>
                                </div>
                            </div>
                            <div className="right-side">
                                <div className="content-box">
                                    <div className="title-top">
                                        {t("homeTex3")}
                                    </div>
                                    <div className="title">
                                       <span>
                                            "Buyuk yo'l"
                                       </span>
                                        {t("homeTex4")}
                                    </div>
                                    <div className="description">
                                        {item.description}
                                    </div>
                                </div>
                            </div>
                        </div>
                    })
                }
            </div>

            <div className="service-wrapper">
                <div className="content-box container">
                    <div className="title">
                        {t('service')}
                    </div>

                    <div className="bottom-side">
                        <div className="service-one">
                            <div className="num">01</div>
                            <div className="text">
                                {t("service1")}
                            </div>
                        </div>
                        <div className="service-two">
                            <div className="num">02</div>
                            <div className="text">
                                {t("service2")}
                            </div>
                        </div>
                        <div className="service-three">
                            <div className="num">03</div>
                            <div className="text">
                                {t("service3")}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="section-one container">
                <div className="news-box">
                    <div className="title">
                        {t('news')}
                    </div>

                    <div className="content-box" data-aos="flip-up">
                        <Slider {...settingsForNews} >
                            {
                                newsList.map((item, index) => {
                                    return <div key={index} className="click-slide-box">
                                        <div className="photo">
                                            <img src={item.image} alt=""/>
                                        </div>
                                        <div className="text">

                                            <div className="titlenews">
                                                {item.title}
                                            </div>
                                            <div className="description">
                                                {item.description}
                                            </div>
                                        </div>
                                    </div>
                                })
                            }
                        </Slider>
                    </div>
                </div>

                <div className="partners-box">
                    <div className="title">{t('partners')}</div>
                    <div className="content-box" data-aos="zoom-in">
                        <Slider {...settingsForStills} >
                            {
                                partners.map((item, index) => {
                                    return <div key={index} className="click-slide-box">
                                        <div className="photo">
                                            <div className="img-box">
                                                <img src={item.logo} alt=""/>
                                            </div>
                                            <div className="name-box">{item.name}</div>
                                        </div>
                                    </div>
                                })
                            }

                        </Slider>
                    </div>
                </div>
            </div>

            <div className="statistics">
                <div className="title">
                    {t('statistics')}
                </div>

                <div className="box" data-aos="flip-left">
                    <div className="bottom-side">
                        <div className="count">{statistics ? statistics.client : ""}+</div>
                        <div className="name">{t('userCount')}</div>
                    </div>
                </div>

                <div className="box" data-aos="flip-left" data-aos-duration="1000">
                    <div className="bottom-side">
                        <div className="count">{statistics ? statistics.order : ""}+</div>
                        <div className="name">{t('bagsCount')}</div>
                    </div>
                </div>

                <div className="box" data-aos="flip-left" data-aos-duration="1500">
                    <div className="bottom-side">
                        <div className="count">{statistics ? statistics.driver : ""}+</div>
                        <div className="name">{t('Users')}</div>
                    </div>
                </div>
            </div>

            <div className="contact-form container">
                <input onChange={getInputs} id="first_name" name="first_name" placeholder={t('name')}
                       type="text"/>

                <input onChange={getInputs} id="phone" name="phone" placeholder={t('tel')} type="text"/>

                <div onClick={handleSendMessage} className="button-send">
                    {
                        checkSuccess ? <div className="wrapper">
                            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                                <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                            </svg>
                        </div> : <span>
                            {t('sentButton')}
                        </span>
                    }
                </div>
            </div>
        </div>
        <Footer/>
    </div>
};

export default Home