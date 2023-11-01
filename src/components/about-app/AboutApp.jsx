import "./about-app.scss"
import Navbar from "../navbar/Navbar";
import Footer from "../footer/footer";
import {useTranslation} from "react-i18next";
import {useState} from "react";


const AboutApp = () => {
    const {t} = useTranslation();

    const [video, setVideo]= useState(true);

    return <div className="about-app-wrapper">
        <div className="mirror-sloy">
            <div className="navbar-box">
                <Navbar/>
            </div>

            <div className="header-side">
                <div onClick={()=>setVideo(true)} className={`header-item ${ video ? "header-active": "" }`}>
                    <div className="image">
                        <img src="./images/video.png" alt=""/>
                    </div>
                    <div className="name">{t('aboutApp')}</div>
                </div>

                <div onClick={()=>setVideo(false)} className={`header-item ${ !video ? "header-active": "" }`}>
                    <div className="image">
                        <img src="./images/video.png" alt=""/>
                    </div>
                    <div className="name">{t('aboutApp2')}</div>
                </div>
            </div>

            <div className="video-box">
                {
                    video ? <iframe width="560" height="315" src="https://www.youtube.com/embed/-Sxm1lKB2ds"
                                    title="YouTube video player" frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen></iframe>

                        : <iframe width="560" height="315" src="https://www.youtube.com/embed/WL2DGKXqe_4"
                                  title="YouTube video player" frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                  allowFullScreen></iframe>
                }
            </div>

            <Footer/>
        </div>
    </div>
};

export default AboutApp