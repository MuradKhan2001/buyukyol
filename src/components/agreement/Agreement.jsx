import "./agreement.scss"
import Navbar from "../navbar/Navbar";
import Footer from "../footer/footer";
import {useTranslation} from "react-i18next";
import {useContext, useEffect, useState} from "react";
import {MyContext} from "../app/App";
import axios from "axios";
import { saveAs } from "file-saver";


const Agreement = () => {
    let value = useContext(MyContext);
    const [MainList, setMainList] = useState([]);
    const {t} = useTranslation();


    useEffect(() => {
        axios.get(`${value.url}dashboard/termsandconditions/`, {
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

    const getDownloadFile = async (file) => {
        let format = file.split(".");

        return axios.get(file, {
            responseType: 'blob'
        }).then((response) => {
            saveAs(response.data, `contract.${format[format.length-1]}`)
        })
    };

    return <div className="agreement-wrapper">
        <div className="mirror-sloy">
            <Navbar/>
            {
                MainList.map((item, index) => {
                    return <div key={index} className="list-agreement container">
                        <div className="header-side">
                            <div className="paper-clip">
                                <img src="./images/clip.png" alt=""/>
                            </div>
                            <div className="icon">
                                <div onClick={() => getDownloadFile(item.contract)}>
                                    <img src="./images/download.png" alt=""/>
                                </div>
                                <p>
                                    {t("download")}
                                </p>
                            </div>
                        </div>
                        <div className="body-side">
                            <div className="title">{t('contract')}</div>
                            <div className="text">
                                {item.description}
                            </div>
                        </div>
                    </div>
                })
            }
            <Footer/>
        </div>
    </div>
};

export default Agreement