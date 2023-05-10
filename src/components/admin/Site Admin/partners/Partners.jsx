import "./style.scss"
import {useContext, useEffect, useState} from "react";
import {MyContext} from "../../../app/App";
import axios from "axios";

const PartnersA = () => {
    let value = useContext(MyContext);
    const [MainList, setMainList] = useState([]);
    const [partnersList, setPartnersList] = useState({
        namePartner: "",
        logo: null,
        contract: null
    });

    const getName = (e) => {
        partnersList.namePartner = e.target.value;
    };

    function getFile(e) {
        partnersList[e.target.name] = e.target.files[0];
    }

    const getList = () => {

        axios.get(`${value.url}dashboard/partner/`, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
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

    const AddPartner = () => {
        if (partnersList.namePartner.trim().length > 0 && partnersList.logo && partnersList.contract) {

            let Post = new FormData();

            Post.append("name",partnersList.namePartner);
            Post.append("logo",partnersList.logo);
            Post.append("contract",partnersList.contract);


            axios.post(`${value.url}dashboard/partner/`, Post, {
                headers: {
                    "Authorization": `Token ${localStorage.getItem("token")}`
                }
            }).then((response) => {
                getList();
                let newList = {
                    name: "",
                    logo: null,
                    contract: null
                };
                setPartnersList(newList);
                document.getElementById('name').value = "";
                document.getElementById('logo').value = "";
                document.getElementById('contract').value = "";

            }).catch(() => {
            });

        } else alert("Formani toldiring")
    };

    const delPartner = (id) =>{
        axios.delete(`${value.url}dashboard/partner/${id}`).then(()=>{
            getList()
        })
    };


    return <div className="partners-admin-box">
        <div className="content-card">
            <div className="left">

                <div className="inputs">
                    <input id="name" onChange={getName} name="name" placeholder="Firma nomi" type="text"/>

                    <label htmlFor="logo">Logotip:</label>
                    <input onChange={getFile} name="logo" id="logo" type="file"/>

                    <label htmlFor="contract">Shartnoma:</label>
                    <input onChange={getFile} name="contract" id="contract" type="file"/>
                </div>

                <div onClick={AddPartner} className="add-button">Qo'shish</div>

            </div>

            <div className="right">
                {
                    MainList.map((item, index) => {
                        return <div key={index} className="cards">
                            <div className="for-img">
                                <img src={item.logo} alt=""/>
                            </div>

                            <div className="for-text">
                                <div className="title">{item.name}</div>
                            </div>
                            <div className="for-btns">
                                <div>
                                    <a href={item.contract} target="_blank">
                                        <img src="../images/download.png" alt=""/>
                                    </a>
                                </div>
                                <div>
                                    <img onClick={()=>delPartner(item.id)} src="../images/admin/delete.png" alt=""/>
                                </div>
                            </div>
                        </div>
                    })
                }

            </div>

        </div>
    </div>
};

export default PartnersA