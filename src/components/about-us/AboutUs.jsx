import "./about-us.scss"
import Navbar from "../navbar/Navbar";
import Footer from "../footer/footer";
import {useTranslation} from "react-i18next";
import {useContext, useEffect, useState} from "react";
import {MyContext} from "../app/App";
import axios from "axios";
import i18next from "i18next";

const AboutUs = () => {
    let value = useContext(MyContext);
    const [MainList, setMainList] = useState([]);
    const {t} = useTranslation();

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

    }, []);


    return <div className="about-us-wrapper">
        <div className="navbar-box">
            <Navbar/>
        </div>

        {
            MainList.map((item,index)=>{
                return  <div key={index} className="content-box container">
                    <div className="left-side">
                        <div className="card-box"></div>
                        <div className="img-box">
                            <img src={item.image} alt=""/>
                        </div>
                    </div>
                    <div className="right-side">
                        <div className="content-box">
                            <div className="title">
                                {t('about')}
                            </div>
                            <div className="description">
                                {item.description}
                            </div>
                        </div>
                    </div>
                </div>
            })
        }

        <Footer/>
    </div>
};

export default AboutUs