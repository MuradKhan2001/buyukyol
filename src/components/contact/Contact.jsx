import "./contact.scss"
import Navbar from "../navbar/Navbar";
import {useTranslation} from "react-i18next";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import i18next from "i18next";
import {MyContext} from "../app/App";


const Contact = () => {
    let value = useContext(MyContext);
    const [MainList, setMainList] = useState([]);
    const [checkSuccess, setCheckSuccess] = useState(false);
    const [sendBox, setSendBox] = useState({
        first_name: "",
        last_name: "",
        phone: "",
        body: ""
    });
    const {t} = useTranslation();

    const getInputs = (e) => {
        sendBox[e.target.name] = e.target.value;
    };

    useEffect(() => {
        axios.get(`${value.url}dashboard/contact/`, {
            headers: {
                "Accept-Language": i18next.language ? i18next.language : "uz"
            }
        }).then((response) => {
            setMainList(response.data);
        }).catch((error) => {
            if (error.response.statusText == "Unauthorized") {
                window.location.pathname = "/";
                localStorage.removeItem("token");
            }
        });

        const timer = setTimeout(() => {
        }, 1000);
        return () => clearTimeout(timer);

    }, []);

    const handleSendMessage = () => {
        if (sendBox.first_name.trim().length > 0 && sendBox.last_name.trim().length > 0 &&
            sendBox.phone.trim().length > 0 && sendBox.body.trim().length) {

            axios.post(`${value.url}dashboard/contactus/`, sendBox).then((response) => {

                setCheckSuccess(true);

                let newList = {
                    first_name: "",
                    last_name: "",
                    phone: "",
                    body: ""
                };

                setSendBox(newList);

                document.getElementById("first_name").value = "";
                document.getElementById("last_name").value = "";
                document.getElementById("phone").value = "";
                document.getElementById("body").value = "";

                setTimeout(() => {
                    setCheckSuccess(false);
                }, 3000)

            }).catch(() => {

            });

        } else alert("Formani toldiring");


    };

    return <div className="contact-wrapper">

       <div className="mirror-sloy">
           <Navbar/>
           <div className="content container">

               <div className="title">
                   {t('contact')}
               </div>

               <div className="box">

                   <div className="left-side">

                       <div className="title">{t('sentText')}</div>

                       <div className="inputs">

                           <input onChange={getInputs} id="first_name" name="first_name" placeholder={t('name')}
                                  type="text"/>

                           <input onChange={getInputs} id="last_name" name="last_name" placeholder={t('LastName')}
                                  type="text"/>

                           <input onChange={getInputs} id="phone" name="phone" placeholder={t('tel')} type="text"/>

                           <textarea onChange={getInputs} id="body" name="body" placeholder={t('text')}></textarea>

                       </div>

                       <div onClick={handleSendMessage} className="button-send">
                           {
                               checkSuccess ? <div className="wrapper">
                                   <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                       <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                                       <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                                   </svg>
                               </div> : <span >
                                   {t('sentButton')}
                               </span>
                           }
                       </div>

                   </div>

                   {
                       MainList.map((item, index) => {
                           return <div key={index} className="right-side">
                               <div className="items">
                                   <div className="icon">
                                       <img src="./images/phone-call2.png" alt=""/>
                                   </div>
                                   <a href={`tel:${item.phone1}`} className="name">{item.phone1}</a>
                               </div>

                               <div className="items">
                                   <div className="icon">
                                       <img src="./images/phone-call2.png" alt=""/>
                                   </div>
                                   <a href={`tel:${item.phone2}`} className="name">{item.phone2}</a>
                               </div>

                               <div className="items">
                                   <div className="icon">
                                       <img src="./images/telegram2.png" alt=""/>
                                   </div>
                                   <a href={item.telegram} target="_blank" className="name">
                                       buyukyol_uz
                                   </a>
                               </div>

                               <div className="items">
                                   <div className="icon">
                                       <img src="./images/instagram2.png" alt=""/>
                                   </div>
                                   <a href={item.instagram} target="_blank" className="name">
                                       buyukyol_uz
                                   </a>
                               </div>

                               <div className="items">
                                   <div className="icon">
                                       <img src="./images/facebook2.png" alt=""/>
                                   </div>
                                   <a href={item.facebook} target="_blank" className="name">
                                       buyukyol_uz
                                   </a>
                               </div>

                               <div className="items">
                                   <div className="icon">
                                       <img src="./images/placeholder4.png" alt=""/>
                                   </div>
                                   <div className="name">{item.address}</div>
                               </div>

                           </div>
                       })
                   }
               </div>
           </div>
       </div>

    </div>
};

export default Contact