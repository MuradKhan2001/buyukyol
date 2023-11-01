import {useContext, useRef, useState} from "react";
import "./loginClient.scss";
import axios from "axios";
import {MyContext} from "../app/App";
import {useNavigate} from "react-router-dom";
import {useOnKeyPress} from "./useOnKeyPress";
import PhoneInput from 'react-phone-number-input'
import {CSSTransition} from "react-transition-group";
import AuthCode from "react-auth-code-input";
import {useTranslation} from "react-i18next";


const LoginClient = () => {
    let value = useContext(MyContext);
    const {t} = useTranslation();
    const [phone, setPhone] = useState("");
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState("");
    const [nextPage, setNextPage] = useState(false);
    const [alertCancel, setAlertCancel] = useState(false);
    const [statusError, setStatusError] = useState("");
    const [check, setCheck] = useState(0);
    const nodeRef = useRef(null);

    const navigate = useNavigate();

    const HandleLogin = () => {
        if (phone.trim().length > 4) {
            let user = {
                phone: phone,
                user_type: "Client"
            };
            axios.post(`${value.url}api/login/`, user).then((response) => {

                if (response.data.user) {
                    localStorage.setItem("userId", response.data.user);
                    setLoading("Loading...");
                    setNextPage(true)
                } else {
                    setStatusError("1");
                    setAlertCancel(true);
                    setTimeout(() => {
                        setAlertCancel(false);
                    }, 5000)
                }

            }).catch((error) => {
                if (error.response.status === 404) {
                    setStatusError("1");
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

    const CheckCode = () => {

        if (code.trim().length === 5) {

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

    const Clear = () => {
        setPhone("");
        setCode("")
    };

    useOnKeyPress(nextPage ? CheckCode : HandleLogin, 'Enter');
    useOnKeyPress(Clear, 'Delete');

    return <div className="login-container">

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
            nextPage ? <div className="login-card">
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

                {
                    check < 3 && <div onClick={() => {
                        if (check < 3) {
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
                }

                    <div onClick={CheckCode} onKeyUp={() => console.log("enter")} className="login-btn">
                        {t("button2")}
                    </div>

                </div> :
                <div className="login-card">
                    <div className="logo">
                        <img onClick={() => {
                            navigate('/')
                        }} src="../images/logo1.png" alt=""/>
                    </div>

                    <div className="title">
                        {t("button5")}
                    </div>

                    <div className="inputs">
                        <PhoneInput
                            international
                            defaultCountry="UZ"
                            value={phone}
                            onChange={setPhone}/>
                    </div>

                    <div onClick={HandleLogin} onKeyUp={() => console.log("enter")} className="login-btn">
                        {loading ? <div className="lds-ring">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div> : t("button1")}
                    </div>

                    <div onClick={() => navigate("/register-client")} className="title-register">
                        {t("button6")}
                    </div>
                </div>
        }
    </div>
};

export default LoginClient