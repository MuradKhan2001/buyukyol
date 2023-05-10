import "./style.scss"
import {useContext, useEffect, useState} from "react";
import {MyContext} from "../../../app/App";
import axios from "axios";

const Moments = () => {
        let value = useContext(MyContext);
        const [MainList, setMainList] = useState([]);
        const [image, setImage] = useState(null)

        const getList = () => {
            axios.get(`${value.url}dashboard/galary/`, {
                headers: {
                    "Authorization": `Token ${localStorage.getItem("token")}`,
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
            if (image) {

                let Post = new FormData();

                Post.append("image", image)

                axios.post(`${value.url}dashboard/galary/`, Post, {
                    headers: {
                        "Authorization": `Token ${localStorage.getItem("token")}`
                    }
                }).then(() => {

                    getList();
                    document.getElementById('image').value = ""
                }).catch(() => {

                });

            } else
                alert("Formani to'ldiring")

        }

        const delImage = (id) => {
            axios.delete(`${value.url}dashboard/galary/${id}/`, {
                headers: {
                    "Authorization": `Token ${localStorage.getItem("token")}`
                }
            }).then(() => {
                getList();
            }).catch(() => {
            });
        };

        return <div className="moments-admin-box">
            <div className="content-card">
                <div className="left">

                    <div className="inputs">
                        <label htmlFor="photo">Rasm tanlang:</label>
                        <input onChange={(e) => setImage(e.target.files[0])} id="image" type="file"/>
                    </div>
                    <div onClick={pushInfo} className="add-button">Qo'shish</div>

                </div>

                <div className="right">
                    {
                        MainList.map((item, index) => {
                            return <div key={index} className="cards">
                                <div className="for-img">
                                    <img src={item.image} alt=""/>
                                </div>
                                <div className="for-btns">
                                    <div>
                                        <img onClick={()=>delImage(item.id)} src="../images/admin/delete.png" alt=""/>
                                    </div>
                                </div>
                            </div>
                        })
                    }

                </div>

            </div>
        </div>
    }
;

export default Moments