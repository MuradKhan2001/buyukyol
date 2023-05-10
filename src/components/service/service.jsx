import "./service.scss"
import Navbar from "../navbar/Navbar";
import Footer from "../footer/footer";
import {useTranslation} from "react-i18next";
import {useContext, useEffect, useState} from "react";
import Aos from "aos";
import axios from "axios";
import {MyContext} from "../app/App";

const Service = () => {
    let value = useContext(MyContext);
    const [MainList, setMainList] = useState([]);
    const {t} = useTranslation();


    useEffect(() => {

        axios.get(`${value.url}dashboard/services/`, {
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

        Aos.init({duration: 600});
    }, []);


    return <div className="service-wrapper">
        <Navbar/>
        <div className="content-box container">
            <div className="title">
                {t('service')}
            </div>

            <div className="bottom-side">
                {
                    MainList.map((item, index) => {
                        return <div key={index} className="service-card" data-aos="flip-right">
                            <div className="photo"><img src={item.image} alt=""/></div>
                            <div className="title">{item.title}</div>
                            <div className="text">
                                {item.description}
                            </div>
                        </div>
                    })
                }
            </div>
        </div>

        <Footer/>
    </div>
};

export default Service