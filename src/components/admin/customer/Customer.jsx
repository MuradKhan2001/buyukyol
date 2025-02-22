import "./customer.scss";
import Modal from 'react-bootstrap/Modal';
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {MyContext} from "../../app/App";


const Customer = () => {
    let value = useContext(MyContext);
    const [getSearchText, setGetSearchText] = useState("");
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [showEdit, setShowEdit] = useState(false);
    const [MainList, setMainList] = useState([]);
    const [links, setLinks] = useState({});
    const [Pages, setPages] = useState([]);
    const [activeItem, setActiveItem] = useState(1);
    const [Customer, setCustomer] = useState({
        first_name: "",
        last_name: "",
        user_type: "Client",
        phone: ""
    });
    const [userId, setUserId] = useState("");

    const getInputs = (e) => {
        Customer[e.target.name] = e.target.value;
    };

    const getList = (url = null, page = 1) => {
        const main = url ? url : `${value.url}dashboard/clients/?page=${page}`;
        axios.get(main, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then((response) => {
            setMainList(response.data.results);
            setLinks(response.data.links);
            setPages(response.data.links.pages);
            setActiveItem(page);
        }).catch((error) => {
            if (error.response && error.response.statusText === "Unauthorized") {
                window.location.pathname = "/";
                localStorage.removeItem("token");
            }
        });
    };

    const visiblePages = [];
    const totalPages = Pages.length;

    if (totalPages <= 7) {
        visiblePages.push(...Pages.map((_, index) => index + 1));
    } else {
        visiblePages.push(1);

        if (activeItem > 3) {
            visiblePages.push("...");
        }

        for (let i = Math.max(2, activeItem - 1); i <= Math.min(totalPages - 1, activeItem + 1); i++) {
            visiblePages.push(i);
        }

        if (activeItem < totalPages - 2) {
            visiblePages.push("...");
        }

        visiblePages.push(totalPages);
    }

    useEffect(() => {
        getList()
    }, []);

    const AddCustomer = () => {
        if (Customer.phone.trim().length > 0 && Customer.first_name.trim().length > 0
            && Customer.last_name.trim().length > 0) {
            axios.post(`${value.url}dashboard/clients/`, Customer, {
                headers: {
                    "Authorization": `Token ${localStorage.getItem("token")}`
                }
            }).then(() => {
                getList(null, activeItem);
                let newList = {
                    first_name: "",
                    last_name: "",
                    user_type: "Client",
                    phone: ""
                };
                setCustomer(newList);
                handleClose();
            }).catch((error) => {
                if (error.response.status == 400) alert("Bunday raqam ro'yxatdan o'tilgan")
            });

        } else alert("Formani to'ldiring")
    };

    const EditCustomer = (ind) => {
        let newList = {
            first_name: MainList[ind].first_name,
            last_name: MainList[ind].last_name,
            phone: MainList[ind].phone
        };
        setCustomer(newList)

        document.getElementById('first_name').value = MainList[ind].first_name;
        document.getElementById('last_name').value = MainList[ind].last_name;
        document.getElementById('phone').value = MainList[ind].phone;
    };

    const EditCustomer2 = () => {
        axios.patch(`${value.url}dashboard/clients/${userId}/`, Customer, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then(() => {
            getList(null, activeItem);
            let newList = {
                first_name: "",
                last_name: "",
                user_type: "Client",
                phone: ""
            };
            setCustomer(newList);
            setShowEdit(false);
        }).catch(() => {

        });
    };


    return <div className="customer-container">
        <div className="search-box">
            <div className="inputs">
                <input onChange={(e) => setGetSearchText(e.target.value)} placeholder="Tel nomer orqali izlash..."
                       type="text"/>
                <div className="serach-btn"><img src="../images/admin/search.png" alt=""/></div>
            </div>

            <div onClick={() => {
                handleShow();
            }} className="add-driver">
                Mijoz qo'shish
                <img src="../images/admin/add1.png" alt=""/>
            </div>
        </div>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <div className="edit">Mijoz qo'shish</div>
            </Modal.Header>
            <Modal.Body>
                <input onChange={getInputs} name="first_name" placeholder="Ism" type="text"/>
                <input onChange={getInputs} name="last_name" placeholder="Familiya" type="text"/>
                <input onChange={getInputs} name="phone" placeholder="Tel raqam" type="text"/>
            </Modal.Body>
            <Modal.Footer>
                <button onClick={() => {
                    handleClose()
                    AddCustomer();
                }}>
                    Qo'shish
                </button>
            </Modal.Footer>
        </Modal>

        <div className={`edit-box ${!showEdit ? "edit-box-hide" : ""}`}>
            <div className="title">Tahrirlash</div>
            <input onChange={getInputs} name="first_name" id="first_name" placeholder="Ism" type="text"/>
            <input onChange={getInputs} name="last_name" id="last_name" placeholder="Familiya" type="text"/>
            <input onChange={getInputs} name="phone" id="phone" placeholder="Telefon raqam" type="text"/>

            <div className="buttons">
                <div onClick={() => setShowEdit(false)} className="cancel-btn">Bekor qilish</div>
                <div onClick={() => {
                    setShowEdit(false);
                    EditCustomer2();
                }} className="edit-btn">Tahrirlash
                </div>
            </div>
        </div>

        <div className="table-content">
            <table>
                <thead>
                <tr>
                    <th>№</th>
                    <th>F.I.SH</th>
                    <th>Tel</th>
                    <th>Bloklash</th>
                    <th>Tahrirlash</th>
                </tr>
                </thead>
                <tbody>
                {MainList.filter((item) => {
                    return getSearchText.toLowerCase() === ""
                        ? item
                        : item.phone.toLowerCase().includes(getSearchText);
                }).map((item, index) => {
                    return <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                            {item.first_name} <br/>
                            {item.last_name}
                        </td>
                        <td>{item.phone}</td>
                        <td>
                            <div>
                                {item.is_block ? <img onClick={() => {
                                        axios.post(`${value.url}dashboard/clients/${item.id}/block/`, {}, {
                                            headers: {
                                                "Authorization": `Token ${localStorage.getItem("token")}`
                                            }
                                        }).then((response) => {
                                            getList(null, activeItem);
                                        }).catch((error) => {

                                        });

                                    }} src={`../images/admin/block.png`} alt=""/> :
                                    <img onClick={() => {
                                        axios.post(`${value.url}dashboard/clients/${item.id}/block/`, {}, {
                                            headers: {
                                                "Authorization": `Token ${localStorage.getItem("token")}`
                                            }
                                        }).then((response) => {
                                            getList(null, activeItem);
                                        }).catch((error) => {

                                        });

                                    }} src={`../images/admin/block1.png`} alt=""/>}
                            </div>
                        </td>
                        <td>
                            <div>
                                <img onClick={() => {
                                    setShowEdit(true);
                                    EditCustomer(index);
                                    setUserId(item.id)
                                }} src={`../images/admin/edit.png`} alt=""/>
                            </div>
                        </td>
                    </tr>
                })}
                </tbody>
            </table>
        </div>

        <div className="pagination">
            <div className="prev">
                <img onClick={() => {
                    if (activeItem > 1) {
                        getList(links.previous, activeItem - 1);
                    }
                }} src="./images/admin/prev.png" alt="Prev"/>
            </div>

            {visiblePages.map((item, index) => (
                <div key={index}
                     onClick={() => {
                         if (item !== "...") {
                             getList(null, item);
                         }
                     }}
                     className={`items ${activeItem === item ? "active" : ""} `}
                     style={{cursor: item === "..." ? "default" : "pointer"}}>
                    {item}
                </div>
            ))}

            <div className="next" onClick={() => {
                if (activeItem < totalPages) {
                    getList(links.next, activeItem + 1);
                }
            }}>
                <img src="./images/admin/next.png" alt="Next"/>
            </div>
        </div>
    </div>
};

export default Customer