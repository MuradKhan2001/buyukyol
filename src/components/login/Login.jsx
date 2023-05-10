import {useContext, useEffect, useState} from "react";
import "./login.scss";
import axios from "axios";
import {MyContext} from "../app/App";
import {useNavigate} from "react-router-dom";
import {useOnKeyPress} from "./useOnKeyPress";


const Login = () => {
    let value = useContext(MyContext);
    const [phone, setPhone]=useState("");
    const [password, setPassword]=useState("");
    const [loading, setLoading]= useState("")

    const navigate = useNavigate();

    const HandleLogin = () =>{

      if (phone.trim().length > 0 && password.trim().length > 0){
          let user={
              phone,
              password
          };

          axios.post(`${value.url}dashboard/admin-login/`, user).then((response)=>{
              setLoading("Loading...")
              localStorage.setItem("token", response.data.token);
              window.location.pathname='/';
              localStorage.setItem("lng", "uz")
          }).catch((error)=>{
              if (error.response.status === 404) alert("Bu foydalanuvchi topilmadi");
          });

      }else alert("Formani to'ldiring")

    };

    const Clear = ()=>{
        setPhone("");
        setPassword("");
    };

    useOnKeyPress(HandleLogin, 'Enter');
    useOnKeyPress(Clear, 'Delete');

    return <div className="login-container">
        <div className="login-card">
            <div className="logo">
                <img onClick={()=>{
                    navigate('/')
                }} src="../images/logo1.png" alt=""/>
            </div>
            <div className="inputs">
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Tel:" type="number"/>
                <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Parol" type="password"/>
            </div>
            <div onClick={HandleLogin} onKeyUp={()=>console.log("enter")} className="login-btn">
                {loading ? <div className="lds-ring">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>  :"Kirish"}
            </div>
        </div>
    </div>
};

export default Login