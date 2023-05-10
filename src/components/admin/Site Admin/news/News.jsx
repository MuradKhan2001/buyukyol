import "./style.scss"
import {useContext, useEffect, useState} from "react";
import {MyContext} from "../../../app/App";
import axios from "axios";

const News = () =>{
    let value = useContext(MyContext);
    const [MainList, setMainList] = useState([]);

    const [desUz, setDesUz] = useState("");
    const [desEn, setDesEn] = useState("");
    const [desRu, setDesRu] = useState("");
    const [desUZB, setDesUZB] = useState("");

    const [TitleUz, setTitleUz] = useState("");
    const [TitleEn, setTitleEn] = useState("");
    const [TitleRu, setTitleRu] = useState("");
    const [TitleUZB, setTitleUZB] = useState("");

    const getImage = (e) => {
        setImage(e.target.files[0])
    };

    const [image, setImage] = useState(null);

    const getList = (lng) => {
        axios.get(`${value.url}dashboard/news/`, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`,
                "Accept-Language": lng ? lng : "uz"
            }
        }).then((response) => {
            setMainList(response.data);
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
            desUZB.trim().length > 0 && image && TitleUz.trim().length > 0 && TitleEn.trim().length > 0
        && TitleRu.trim().length > 0 && TitleUZB.trim().length > 0) {

            let Post = new FormData();

            const translations = {
                en: {
                    description: desEn,
                    title:TitleEn
                },
                ru: {
                    description: desRu,
                    title: TitleRu
                },
                uz: {
                    description: desUz,
                    title: TitleUz
                },
                ro: {
                    description: desUZB,
                    title: TitleUZB
                },
            };

            Post.append("translations", JSON.stringify(translations));
            Post.append("image", image);

            axios.post(`${value.url}dashboard/news/`, Post, {
                headers: {
                    "Authorization": `Token ${localStorage.getItem("token")}`
                }
            }).then((response) => {

                getList();

                document.getElementById('desUz').value= "";
                document.getElementById('desEn').value= "";
                document.getElementById('desRu').value= "";
                document.getElementById('desUZB').value= "";
                document.getElementById('TitleUz').value= "";
                document.getElementById('TitleEn').value= "";
                document.getElementById('TitleRu').value= "";
                document.getElementById('TitleUZB').value= "";
                document.getElementById('photo').value= "";

            }).catch(() => {

            });

        } else alert("Formani to'ldiring")

    };

    const delInfo = (id) =>{
        axios.delete(`${value.url}dashboard/news/${id}/`, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then((response) => {
            getList();
        }).catch(() => {
        });
    };


    return <div className="news-admin-box">
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
                    <label >UZ:</label>
                    <input id="TitleUz" onChange={(e)=>setTitleUz(e.target.value)} placeholder="Sarlavha" type="text"/>
                    <textarea id="desUz" onChange={(e)=>setDesUz(e.target.value)} placeholder="Ma'lumot uchun"></textarea>

                    <label >ЎЗБ:</label>
                    <input id="TitleEn" onChange={(e)=>setTitleUZB(e.target.value)} placeholder="Сарлавҳа" type="text"/>
                    <textarea id="desEn" onChange={(e)=>setDesUZB(e.target.value)} placeholder="Маълумот учун"></textarea>

                    <label >RU:</label>
                    <input id="TitleRu" onChange={(e)=>setTitleRu(e.target.value)} placeholder="Заголовок" type="text"/>
                    <textarea id="desRu" onChange={(e)=>setDesRu(e.target.value)} placeholder="Для информации"></textarea>

                    <label >EN:</label>
                    <input id="TitleUZB" onChange={(e)=>setTitleEn(e.target.value)} placeholder="Title" type="text"/>
                    <textarea id="desUZB" onChange={(e)=>setDesEn(e.target.value)} placeholder="For reference"></textarea>

                    <label htmlFor="photo">Rasm:</label>
                    <input onChange={getImage} id="photo" type="file"/>

                    <div onClick={pushInfo} className="add-button">Qo'shish</div>
                </div>
            </div>

            <div className="right">
                {
                    MainList.map((item,index) => {
                        return <div key={index} className="cards">
                            <div className="for-img">
                                <img src={item.image} alt=""/>
                            </div>

                            <div className="for-text">
                                <div className="title">{item.title}</div>
                                <div className="des">
                                    {item.description}
                                </div>
                            </div>
                            <div className="for-btns">
                                <div>
                                    <img onClick={()=>delInfo(item.id)} src="../images/admin/delete.png" alt=""/>
                                </div>
                            </div>
                        </div>
                    })
                }
            </div>

        </div>
    </div>
};

export default News