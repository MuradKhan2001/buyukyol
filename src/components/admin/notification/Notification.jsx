import "./notification.scss";
import {useContext, useEffect, useState} from "react";
import {MyContext} from "../../app/App";
import Driver from "../driver/Driver";
import axios from "axios";

const Notification = () => {
    let value = useContext(MyContext);
    const [sideNav, setSideNav] = useState(true);
    const [MainListDriver, setMainListDriver] = useState([]);
    const [MainListClient, setMainListClient] = useState([]);
    const [listDriver, setListDriver] = useState({
        title: "",
        image: null,
        description: "",
        receiver: "Driver"
    });
    const [listClient, setListClient] = useState({
        title: "",
        image: null,
        description: "",
        receiver: "Client"
    });

    const [editClient, setEditClient] = useState(false);
    const [editDriver, setEditDriver] = useState(false);
    const [editIndex, setEditIndex]= useState("")


    const getInputsDriver = (e) => {
        listDriver[e.target.name] = e.target.value;
    };

    function getImageDriver(e) {
        listDriver[e.target.name] = e.target.files[0];
    }

    const getInputsClient = (e) => {
        listClient[e.target.name] = e.target.value;
    };

    function getImageClient(e) {
        listClient[e.target.name] = e.target.files[0]
    }

    const getList = () => {
        axios.get(`${value.url}api/news/`, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            },
            params: {
                user_type: "Driver"
            }
        }).then((response) => {
            setMainListDriver(response.data)
        }).catch((error) => {
            if (error.response.statusText == "Unauthorized") {
                window.location.pathname = "/";
                localStorage.removeItem("token");
            }
        })

        axios.get(`${value.url}api/news/`, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            },
            params: {
                user_type: "Client"
            }
        }).then((response) => {
            setMainListClient(response.data)
        }).catch((error) => {
            if (error.response.statusText == "Unauthorized") {
                window.location.pathname = "/";
                localStorage.removeItem("token");
            }
        })
    };

    useEffect(() => {
        getList();
    }, []);

    const addList = (name) => {
        if (name === "driver") {
            if (listDriver.image && listDriver.title.trim().length > 0
                && listDriver.description.trim().length > 0) {

                let Post = new FormData();
                for (let key in listDriver) {
                    Post.append(key, listDriver[key])
                }

                axios.post(`${value.url}api/news/`, Post, {
                    headers: {
                        "Authorization": `Token ${localStorage.getItem("token")}`
                    }
                }).then(() => {
                    getList();
                    let newList = {
                        title: "",
                        image: null,
                        description: "",
                        receiver: "Driver"
                    };
                    setListDriver(newList);
                    document.getElementById('titleDriver').value = ""
                    document.getElementById('descriptionDriver').value = ""
                    document.getElementById('photoDriver').value = ""
                }).catch(() => {
                });

            } else alert("Formani to'ldiring")
        }

        if (name === "client") {
            if (listClient.image && listClient.title.trim().length > 0
                && listClient.description.trim().length > 0) {

                let Post = new FormData();

                for (let key in listClient) {
                    Post.append(key, listClient[key])
                }

                axios.post(`${value.url}api/news/`, Post, {
                    headers: {
                        "Authorization": `Token ${localStorage.getItem("token")}`
                    }
                }).then(() => {
                    getList();
                    let newList = {
                        title: "",
                        image: null,
                        description: "",
                        receiver: "Client"
                    };
                    setListClient(newList);
                    document.getElementById('titleClient').value = ""
                    document.getElementById('descriptionClient').value = ""
                    document.getElementById('photoClient').value = ""
                }).catch(() => {

                });

            } else alert("Formani to'ldiring")
        }
    };

    const delList = (id, name) => {
        if (name === "driver") {
            axios.delete(`${value.url}api/news/${id}/`, {
                headers: {
                    "Authorization": `Token ${localStorage.getItem("token")}`
                },
                params: {
                    user_type: "Driver"
                }
            }).then((response) => {
                getList()
            }).catch(() => {

            })
        }

        if (name === "client") {
            axios.delete(`${value.url}api/news/${id}/`, {
                headers: {
                    "Authorization": `Token ${localStorage.getItem("token")}`
                },
                params: {
                    user_type: "Client"
                }
            }).then(() => {
                getList()
            }).catch(() => {

            })
        }
    };

    const editList1 = (ind, name, id) => {
        setEditIndex(id)
        if (name === "driver") {
            setEditDriver(true);
            let newList = {
                title: MainListDriver[ind].title,
                description: MainListDriver[ind].description,
                receiver: "Driver"
            };
            setListDriver(newList)
            document.getElementById('titleDriver').value = MainListDriver[ind].title;
            document.getElementById('descriptionDriver').value = MainListDriver[ind].description
        }

        if (name === "client") {
            setEditClient(true);
            let newList = {
                title: MainListClient[ind].title,
                description: MainListClient[ind].description,
                receiver: "Client"
            };
            setListClient(newList)
            document.getElementById('titleClient').value = MainListClient[ind].title;
            document.getElementById('descriptionClient').value = MainListClient[ind].description
        }
    };

    const editList2 = (name) =>{
        if (name === "driver") {
            let Post = new FormData();
            for (let key in listDriver) {
                Post.append(key, listDriver[key])
            }
            axios.patch(`${value.url}api/news/${editIndex}/`, Post, {
                headers: {
                    "Authorization": `Token ${localStorage.getItem("token")}`
                },
                params: {
                    user_type: "Driver"
                }
            }).then(() => {
                getList();
                setEditDriver(false)
                let newList = {
                    title: "",
                    image: null,
                    description: "",
                    receiver: "Driver"
                };
                setListDriver(newList);
                document.getElementById('titleDriver').value = "";
                document.getElementById('descriptionDriver').value = "";
                document.getElementById('photoDriver').value = ""
            }).catch(() => {
            });
        }

        if (name === "client") {
            let Post = new FormData();

            for (let key in listClient) {
                Post.append(key, listClient[key])
            }

            axios.patch(`${value.url}api/news/${editIndex}/`, Post, {
                headers: {
                    "Authorization": `Token ${localStorage.getItem("token")}`
                },
                params: {
                    user_type: "Client"
                }
            }).then(() => {
                getList();
                setEditClient(false)
                let newList = {
                    title: "",
                    image: null,
                    description: "",
                    receiver: "Client"
                };
                setListClient(newList);
                document.getElementById('titleClient').value = "";
                document.getElementById('descriptionClient').value = "";
                document.getElementById('photoClient').value = "";
            }).catch(() => {

            });
        }
    };


    return <div className="notification-container">
        <div className="header">
            <div onClick={() => {
                setSideNav(true)
                document.getElementById('titleClient').value = ""
                document.getElementById('descriptionClient').value = ""
                document.getElementById('photoClient').value = ""
            }} className={` sides ${sideNav ? "active" : ""}`}>Haydovchilar</div>
            <div onClick={() => {
                document.getElementById('titleDriver').value = ""
                document.getElementById('descriptionDriver').value = ""
                document.getElementById('photoDriver').value = ""
                setSideNav(false)}
            } className={` sides ${!sideNav ? "active" : ""}`}>Mijozlar</div>
        </div>

        {
            sideNav ? <div className="content-card">
                    <div className="left">
                        <div className="inputs">
                            <input name="title" id="titleDriver" onChange={getInputsDriver} placeholder="Sarlavha"
                                   type="text"/>
                            <textarea name="description" id="descriptionDriver" onChange={getInputsDriver}
                                      placeholder="Qisqacha ma'lumot uchun"></textarea>

                            <label htmlFor="photo">Rasm:</label>
                            <input name="image" onChange={getImageDriver} id="photoDriver" type="file"/>
                        </div>
                        {
                            editDriver ? <div className="xbtns">
                                    <div onClick={() => editList2("driver")} className="add-button">Tahrirlash</div>
                                    <div className="xbtn">
                                        <img onClick={()=>{
                                            setEditDriver(false)
                                            let newList = {
                                                title: "",
                                                image: null,
                                                description: "",
                                                receiver: "Driver"
                                            };
                                            setListDriver(newList);
                                            document.getElementById('titleDriver').value = ""
                                            document.getElementById('descriptionDriver').value = ""
                                        }} src="../images/admin/close2.png" alt=""/>
                                    </div>
                                </div> :
                               <div className="xbtns">
                                   <div onClick={() => addList("driver")} className="add-button">Qo'shish</div>
                               </div>
                        }
                    </div>

                    <div className="right">
                        {
                            MainListDriver.map((item, index) => {
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
                                            <img onClick={() => editList1(index, "driver",item.id)} src="../images/admin/edit2.png"
                                                 alt=""/>
                                        </div>
                                        <div>
                                            <img onClick={() => delList(item.id, "driver")} src="../images/admin/delete.png"
                                                 alt=""/>
                                        </div>
                                    </div>
                                </div>
                            })
                        }

                    </div>
                </div> :
                <div className="content-card">
                    <div className="left">
                        <div className="inputs">
                            <input name="title" id="titleClient" onChange={getInputsClient} placeholder="Sarlavha"
                                   type="text"/>
                            <textarea name="description" id="descriptionClient" onChange={getInputsClient}
                                      placeholder="Qisqacha ma'lumot uchun"></textarea>

                            <label htmlFor="photo">Rasm:</label>
                            <input name="image" onChange={getImageClient} id="photoClient" type="file"/>
                        </div>
                        {
                            editClient ? <div className="xbtns">
                                    <div onClick={() => editList2("client")} className="add-button">Tahrirlash</div>
                                    <div className="xbtn">
                                        <img onClick={()=>{
                                            setEditClient(false)
                                            let newList = {
                                                title: "",
                                                image: null,
                                                description: "",
                                                receiver: "Client"
                                            };
                                            setListClient(newList);
                                            document.getElementById('titleClient').value = ""
                                            document.getElementById('descriptionClient').value = ""
                                            document.getElementById('photoClient').value = ""
                                        }} src="../images/admin/close2.png" alt=""/>
                                    </div>
                                </div> :
                                <div className="xbtns">
                                    <div onClick={() => addList("client")} className="add-button">Qo'shish</div>
                                </div>
                        }
                    </div>

                    <div className="right">
                        {
                            MainListClient.map((item, index) => {
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
                                            <img onClick={() => editList1(index, "client", item.id)} src="../images/admin/edit2.png" alt=""/>
                                        </div>
                                        <div>
                                            <img onClick={() => delList(item.id, "client")}
                                                 src="../images/admin/delete.png" alt=""/>
                                        </div>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                </div>
        }

    </div>
};

export default Notification