import {useContext, useEffect, useRef, useState} from "react";
import "./RegisterClient.scss";
import axios from "axios";
import {MyContext} from "../app/App";
import {useNavigate} from "react-router-dom";
import {useOnKeyPress} from "./useOnKeyPress";
import PhoneInput from "react-phone-number-input";
import AuthCode from 'react-auth-code-input';
import {CSSTransition} from "react-transition-group";
import {useTranslation} from "react-i18next";


const RegisterClient = () => {
    let value = useContext(MyContext);
    const {t} = useTranslation();
    const [code, setCode] = useState("");
    const [phone, setPhone] = useState("+998");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [loading, setLoading] = useState("");
    const [alertCancel, setAlertCancel] = useState(false);
    const [statusError, setStatusError] = useState("");
    const [check, setCheck] = useState(0);
    const nodeRef = useRef(null);

    const navigate = useNavigate();

    useEffect(()=>{
        if (sessionStorage.getItem("nextRegister")) {}
        else sessionStorage.getItem("nextRegister",false)
    },[])

    const HandleLogin = () => {
        if (firstname.trim().length > 0 && lastname.trim().length > 0 && phone.trim().length > 0) {
            let user = {
                first_name: firstname,
                last_name: lastname,
                phone: phone,
                user_type: "Client"
            };

            axios.post(`${value.url}api/register/`, user).then((response) => {

                if (response.data.user) {
                    localStorage.setItem("userId", response.data.user);
                    setLoading("Loading...");
                    sessionStorage.setItem("nextRegister", true)
                } else {

                    setStatusError("1");
                    setAlertCancel(true);
                    setTimeout(() => {
                        setAlertCancel(false);
                    }, 5000)
                }

            })
        } else {
            setStatusError("2");
            setAlertCancel(true);

            setTimeout(() => {
                setAlertCancel(false);
            }, 5000)
        }

    };

    const CheckCode = () => {

        if (code.trim().length > 0) {

            axios.post(`${value.url}api/verify/`, {
                user: localStorage.getItem("userId"),
                number: code
            }).then((response) => {

                setLoading("Loading...");
                localStorage.setItem("token", response.data.token);
                navigate("/my-profile")

            }).catch((error) => {
                if (error.response.status === 404) {
                    setStatusError("4");
                    setAlertCancel(true);

                    setTimeout(() => {
                        setAlertCancel(false);
                    }, 5000)

                }
                ;
            });

        } else {
            setStatusError("2");
            setAlertCancel(true);

            setTimeout(() => {
                setAlertCancel(false);
            }, 5000)
        }
    };

    const handleOnChange = (res) => {
        setCode(res);
    };

    const Clear = () => {
        setFirstname("");
        setLastname("");
        setPhone("")
    };
    const prevpage = ()=>{
        sessionStorage.setItem("nextRegister", false)
        window.location.reload()
    }

    useOnKeyPress(sessionStorage.getItem("nextRegister") === "true" ? CheckCode : HandleLogin, 'Enter');
    useOnKeyPress(Clear, 'Delete');

    return <div className="register-container">

        <CSSTransition
            in={alertCancel}
            nodeRef={nodeRef}
            timeout={300}
            classNames="alert"
            unmountOnExit
        >
            <div ref={nodeRef} className="alert-cancel">
                <div className="img-box">
                    {statusError === "3" ? <img src="./images/check-mark.png" alt=""/> :
                        <img src="./images/caution.png" alt=""/>}
                </div>
                <div className={statusError === "3" ? "text-box" : "text-box2"}>
                    {statusError === "1" ? t("alert4") : ""}
                    {statusError === "2" ? t("alert3") : ""}
                    {statusError === "3" ? t("alert6") : ""}
                    {statusError === "4" ? t("alert5") : ""}
                </div>
                <div onClick={() => setAlertCancel(false)} className="close">
                    <img src="./images/close-driver-list.png" alt=""/>
                </div>
            </div>

        </CSSTransition>

        {
            sessionStorage.getItem("nextRegister") === "true" ? <div className="login-card">

                <div onClick={prevpage} className="prev-btn">
                    <img src="./images/prev.png" alt=""/>
                    {t("changeNumber2")}
                </div>

                <div className="logo">
                    <img onClick={() => {
                        navigate('/')
                    }} src="../images/logo1.png" alt=""/>
                </div>

                <div className="title">
                    {t("title1")}
                </div>

                <div className="inputs-verify-code">
                    <AuthCode allowedCharacters='numeric' length="5" onChange={handleOnChange}/>
                </div>

                <div onClick={() => {
                    if (check < 5) {
                        HandleLogin();
                        setAlertCancel(true);
                        setStatusError("3");
                        setCheck(check + 1);
                        setTimeout(() => {
                            setAlertCancel(false);
                        }, 5000)
                    }
                }} className="recode">
                    {t("title2")}
                </div>

                <div onClick={CheckCode} onKeyUp={() => console.log("enter")} className="login-btn">
                    {t("button2")}
                </div>

            </div> : <div className="login-card">
                <div className="logo">
                    <img onClick={() => {
                        navigate('/')
                    }} src="../images/logo1.png" alt=""/>
                </div>

                <div className="title">
                    {t("button6")}
                </div>

                <div className="inputs">

                    <PhoneInput
                        international
                        defaultCountry="UZ"
                        value={phone}
                        onChange={setPhone}/>

                    <input value={firstname} onChange={(e) => setFirstname(e.target.value)} placeholder={t("name")}
                           type="tex"/>
                    <input value={lastname} onChange={(e) => setLastname(e.target.value)} placeholder={t("LastName")}
                           type="tex"/>
                </div>

                <div onClick={() => navigate('/login-client')} className="login-btns">
                    {t("button5")}
                </div>

                <div onClick={HandleLogin} onKeyUp={() => console.log("enter")} className="login-btn">
                    {loading ? <div className="lds-ring">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div> : t("button6")}
                </div>
            </div>
        }


    </div>
};

export default RegisterClient