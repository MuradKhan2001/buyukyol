import "./safety.scss"
import {useContext, useState} from "react";
import axios from "axios";
import {MyContext} from "../../app/App";

const Safety = () => {
    let value = useContext(MyContext);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const changePassword = () => {
        if (oldPassword.trim().length > 0 && newPassword.trim().length > 0 && confirmNewPassword.trim().length > 0) {
            if (newPassword === confirmNewPassword) {
                axios.post(`${value.url}dashboard/reset-password/`, {
                    old_password: oldPassword,
                    new_password: newPassword
                }, {
                    headers: {
                        "Authorization": `Token ${localStorage.getItem("token")}`
                    }
                }).then((response) => {
                    localStorage.removeItem('token');
                    window.location.pathname = "/login"
                }).catch((error) => {
                    if (error.response.status == 404) alert("Eski parol xato")
                });
            } else alert("Yangi parollar mos kelmadi")

        } else alert("Formani to'ldiring")
    };

    return <div className="safety-container">
        <div className="safety-box">
            <div className="logo">
                <img src="./images/logo1.png" alt=""/>
            </div>

            <input onChange={(e) => setOldPassword(e.target.value)} placeholder="Eski parol" type="password"/>
            <input onChange={(e) => setNewPassword(e.target.value)} placeholder="Yangi parol" type="password"/>
            <input onChange={(e) => setConfirmNewPassword(e.target.value)} placeholder="Yangi parolni takrorlang"
                   type="password"/>

            <div onClick={changePassword} className="btn-change-password">Yangilash</div>
        </div>
    </div>
};

export default Safety