import "./style.scss"
import {useContext, useEffect, useState} from "react";
import {MyContext} from "../../../app/App";
import axios from "axios";

const Contract = () => {
    let value = useContext(MyContext);
    const [MainList, setMainList] = useState([]);

    const [desUz, setDesUz] = useState("");
    const [desEn, setDesEn] = useState("");
    const [desRu, setDesRu] = useState("");
    const [desUZB, setDesUZB] = useState("");
    const [fileUz, setFileUz] = useState(null);
    const [fileUZB, setFileUZB] = useState(null);
    const [fileRu, setFileRu] = useState(null);
    const [fileEn, setFileEn] = useState(null);

    const getList = (lng) => {
        axios.get(`${value.url}dashboard/termsandconditions/`, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`,
                "Accept-Language": lng ? lng : "uz"
            }
        }).then((response) => {
            setMainList(response.data);
            console.log(response.data)
        }).catch((error) => {
            if (error.response.statusText == "Unauthorized") {
                window.location.pathname = "/";
                localStorage.removeItem("token");
            }
        });
    };

    useEffect(() => {
        getList();
    }, []);

    const pushInfo = () => {
        if (desUz.trim().length > 0 && desEn.trim().length > 0 && desRu.trim().length > 0 &&
            desUZB.trim().length > 0 && fileEn && fileRu && fileUz && fileUZB) {

            let Post = new FormData();

            const translations = {
                en: {
                    description: desEn
                },
                ru: {
                    description: desRu
                },
                uz: {
                    description: desUz
                },
                ro: {
                    description: desUZB
                },
            };

            Post.append('translations', JSON.stringify(translations));

            Post.append("en", fileEn)
            Post.append("uz", fileUz)
            Post.append("ru", fileRu)
            Post.append("ro", fileUZB)

            console.log(translations)

            axios.post(`${value.url}dashboard/termsandconditions/`, Post, {
                headers: {
                    "Authorization": `Token ${localStorage.getItem("token")}`
                }
            }).then(() => {

                getList();

                document.getElementById('uz').value = "";
                document.getElementById('uzb').value = "";
                document.getElementById('ru').value = "";
                document.getElementById('en').value = "";
                document.getElementById('fileEn').value = "";
                document.getElementById('fileRu').value = "";
                document.getElementById('fileUz').value = "";
                document.getElementById('fileUZB').value = ""

            }).catch((error) => {
                console.log(error)
            });

        } else alert("Formani to'ldiring")

    };

    return <div className="contract-admin-box">
        <div className="header-side">
            <div className="filter-box">
                <div className="inputs">
                    <select name="partner" id="partner" onChange={(e) => {
                        getList(e.target.value)
                    }}>
                        <option value={"uz"}>UZ</option>
                        <option value={"ro"}>ЎЗБ</option>
                        <option value={"ru"}>RU</option>
                        <option value={"en"}>EN</option>
                    </select>
                </div>
            </div>
        </div>
        <div className="content-card">
            <div className="left">
                <div className="inputs">
                    <textarea name="uz" id="uz" onChange={(e) => setDesUz(e.target.value)}
                              placeholder="Ma'lumot uchun"></textarea>

                    <textarea name="uzb" id="uzb" onChange={(e) => setDesUZB(e.target.value)}
                              placeholder="Маълумот учун"></textarea>

                    <textarea name="ru" id="ru" onChange={(e) => setDesRu(e.target.value)}
                              placeholder="Для информации"></textarea>

                    <textarea name="en" id="en" onChange={(e) => setDesEn(e.target.value)}
                              placeholder="For reference"></textarea>

                    <label htmlFor="photo">Shartnoma yuklash uchun:</label>
                    <input onChange={(e) => setFileUz(e.target.files[0])} id="fileUz" type="file"/>

                    <label htmlFor="photo">Шартнома юклаш учун:</label>
                    <input onChange={(e) => setFileUZB(e.target.files[0])} id="fileUZB" type="file"/>

                    <label htmlFor="photo">Для размещения договора::</label>
                    <input onChange={(e) => setFileRu(e.target.files[0])} id="fileRu" type="file"/>

                    <label htmlFor="photo">To post a contract::</label>
                    <input onChange={(e) => setFileEn(e.target.files[0])} id="fileEn" type="file"/>

                    <div onClick={pushInfo} className="add-button">Qo'shish</div>
                </div>
            </div>

            <div className="right">
                {
                    MainList.map((item,index)=>{
                        return  <div key={index} className="cards">

                            <div className="for-text">
                                <div className="title">Shartnoma haqida qisqacha:</div>
                                <div className="des">
                                    {item.description}
                                </div>
                            </div>

                            <div className="for-btns">
                                <div>
                                    <a href={item.contract} target="_blank">
                                        <img src="../images/download.png" alt=""/>
                                    </a>
                                </div>
                            </div>
                        </div>
                    })
                }
            </div>

        </div>
    </div>
};

export default Contract