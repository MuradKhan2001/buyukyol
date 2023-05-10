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


const Home = () => {
    let value = useContext(MyContext);
    const {t} = useTranslation();
    const [newsList, setNewsList] = useState([]);
    const [galary, setGalary] = useState([]);
    const [partners, setPartners] = useState([]);
    const [statistics,setStatistics] = useState({});

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


    return <div className="home-wrapper">
        <div className="home-page">
            <Navbar/>
            <div className={`home-content ${window.screen.width < 768 ? "" : "container"} `}>
                <div className="left-side"></div>
                <div className="ride-side">
                    <div className="text-box">
                        {t('homeText1')}
                        <div><b>  {t('homeText2')} </b></div>
                    </div>

                    <div className="button-box">
                        <button>
                            <div className="icon">
                                <img src="./images/androit.png" alt=""/>
                            </div>
                            <div className="text">
                                <div className="text-top"> GET IN ON</div>
                                <div className="text-bottom"> Google Play</div>
                            </div>
                        </button>
                        <button>
                            <div className="icon">
                                <img src="./images/ios.png" alt=""/>
                            </div>
                            <div className="text">
                                <div className="text-top"> Download on the</div>
                                <div className="text-bottom">App Store</div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div className="section-wrapper">
            <div className="stills" >
                <div className="content-box">
                    <Slider {...settingsForStills} >
                        {
                            galary.map((item,index)=>{
                                return <div key={index} className="click-slide-box">
                                    <div className="photo">
                                        <img
                                            src={item.image}
                                            alt=""/>
                                    </div>
                                </div>
                            })
                        }
                    </Slider>
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
                                newsList.map((item, index)=>{
                                    return  <div key={index} className="click-slide-box">
                                        <div className="photo">
                                            <img src={item.image} alt=""/>
                                        </div>
                                        <div className="text">

                                            <div className="title">
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
                                partners.map((item,index)=>{
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

                <div className="statistics">
                    <div className="title">
                        {t('statistics')}
                    </div>

                    <div className="box-wrapper">
                        <div className="box" data-aos="flip-left" >
                            <div className="top-side">
                                <img src="./images/clients.png" alt=""/>
                            </div>
                            <div className="bottom-side">
                                <div className="count">{statistics ? statistics.client : ""}</div>
                                <div className="name">{t('userCount')}</div>
                            </div>
                        </div>

                        <div className="box" data-aos="flip-left" data-aos-duration="1000">
                            <div className="top-side">
                                <img src="./images/bag.png" alt=""/>
                            </div>
                            <div className="bottom-side">
                                <div className="count">{statistics ? statistics.order : ""}</div>
                                <div className="name">{t('bagsCount')}</div>
                            </div>
                        </div>

                        <div className="box" data-aos="flip-left" data-aos-duration="1500">
                            <div className="top-side">
                                <img src="./images/admin/driver.png" alt=""/>
                            </div>
                            <div className="bottom-side">
                                <div className="count">{statistics ? statistics.driver : ""}</div>
                                <div className="name">{t('Users')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </div>
};

export default Home