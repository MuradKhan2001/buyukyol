import "./orders.scss"
import {useContext, useEffect, useRef, useState} from "react";
import {MyContext} from "../../app/App";
import axios from "axios";
import {CSSTransition} from "react-transition-group";


const Orders = () => {
    let value = useContext(MyContext);
    const [carInformation, setCarInformation] = useState([])
    const nodeRef = useRef(null);
    const [modalShow, setModalShow] = useState(false);
    const [MainList, setMainList] = useState([]);
    const [MainListCount, setMainListCount] = useState("");
    const [Delivered, setDelivered] = useState(0);
    const [Active, setActive] = useState(0);
    const [Rejected, setRejected] = useState(0);
    const [links, setLinks] = useState({});
    const [Pages, setPages] = useState([]);

    const [day, setDay] = useState("");
    const [moth, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [activeItem, setActiveItem] = useState(1);

    const getList = (url = null) => {
        const main = url ? url : `${value.url}dashboard/orders/`;
        axios.get(main, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then((response) => {
            setMainList(response.data.results);
            setMainListCount(response.data.count);
            setLinks(response.data.links)
            setPages(response.data.links.pages)
            if (response.data.Active) {
                setActive(response.data.Active)
            }

            if (response.data.Delivered) {
                setDelivered(response.data.Delivered)
            }

            if (response.data.Rejected) {
                setRejected(response.data.Rejected)
            }
        }).catch((error) => {
            if (error.response.statusText == "Unauthorized") {
                window.location.pathname = "/";
                localStorage.removeItem("token");
            }
        });
    };

    useEffect(() => {
        getList()
    }, []);

    const filter = () => {
        axios.get(`${value.url}dashboard/orders/`, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            },
            params: {day: day, month: moth, year: year}
        }).then((response) => {
            setMainList(response.data.results);
            setMainListCount(response.data.count);
        }).catch(() => {

        });

    };


    return <div className="orders-container">
        <CSSTransition
            in={modalShow}
            nodeRef={nodeRef}
            timeout={300}
            classNames="alert"
            unmountOnExit
        >
            <div
                className="modal-sloy">
                <div ref={nodeRef} className="modal-card">
                    <div className="info-car">
                        <div className="cancel-btn">
                            <img
                                onClick={() => {
                                    setModalShow(false)
                                }}
                                src="./images/admin/cancel.webp"
                                alt="cancel"
                            />

                        </div>
                        <div className="title">Yuk haqida ma'lumotlar</div>
                        <div className="info-box">
                            <div className="info">
                                <div className="name">Mijoz</div>
                                <div
                                    className="val">
                                    {carInformation.get_client && <>
                                        {carInformation.get_client}
                                    </>}
                                </div>
                            </div>
                            <div className="info">
                                <div className="name">Qayerdan</div>
                                <div
                                    className="val">
                                    {carInformation.address_from && <>
                                        {carInformation.address_from}
                                    </>}
                                </div>
                            </div>
                            <div className="info">
                                <div className="name">Qayerga</div>
                                <div
                                    className="val">
                                    {carInformation.address_to && <>
                                        {carInformation.address_to}
                                    </>}
                                </div>
                            </div>
                            <div className="info">
                                <div className="name">Maxsulot nomi / Hajmi</div>
                                <div
                                    className="val">
                                    {carInformation.info && <>
                                        {carInformation.info}
                                    </>}
                                </div>
                            </div>
                            <div className="info">
                                <div className="name">Yetkazish narxi</div>
                                <div
                                    className="val">
                                    {carInformation.price && <>
                                        {carInformation.price} {carInformation.currency}
                                    </>}
                                </div>
                            </div>
                            <div className="info">
                                <div className="name">Xizmat narxi</div>
                                <div className="val">
                                    {carInformation.fee && <>
                                        {carInformation.fee} {carInformation.currency}
                                    </>}
                                </div>
                            </div>
                            {
                                carInformation.get_driver && <div className="info">
                                    <div className="name">Haydovchi</div>
                                    <div className="val">
                                        {carInformation.get_driver && <>
                                            {carInformation.get_driver}
                                        </>}
                                    </div>
                                </div>
                            }
                            <div className="info">
                                <div className="name">Moshina turi</div>
                                <div className="val">
                                    {carInformation.vehicle && <>
                                        {carInformation.vehicle}
                                    </>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CSSTransition>

        <div className="header-side">
            <div className="filter-box">
                <div className="inputs">
                    <input onChange={(e) => setDay(e.target.value)} min={1} max={31} placeholder="kun" type="number"/>
                    <input onChange={(e) => setMonth(e.target.value)} min={1} max={12} placeholder="oy" type="number"/>
                    <input onChange={(e) => setYear(e.target.value)} min={2017} max={2050} placeholder="yil"
                           type="number"/>
                </div>
                <div className="filter-btn">
                    <img onClick={filter} src="../images/admin/filter.png" alt=""/>
                </div>
            </div>
            <div className="main-price">Umumiy buyutrmalar soni: {MainListCount} </div>
        </div>

        <div className="box-orders">
            <div className="count-box">
                <i className="name">Buyurtmalar: </i>
                <div className="number">{MainListCount}</div>
            </div>

            <div className="count-box">
                <i className="name">Jarayonda: </i>
                <div className="number">{Active}</div>
            </div>

            <div className="count-box">
                <i className="name">Bajarilgan: </i>
                <div className="number">{Delivered}</div>
            </div>

            <div className="count-box">
                <i className="name">Bekor bo'lgan: </i>
                <div className="number">{Rejected}</div>
            </div>
        </div>

        <div className="table-content">
            <table>
                <thead>
                <tr>
                    <th>№</th>
                    <th>Yuk xolati</th>
                    <th>Mijoz</th>
                    <th>Berilgan sana</th>
                    <th>Tugatilgan sana</th>
                    <th>Batafsil</th>
                </tr>
                </thead>

                <tbody>
                {
                    MainList.map((item, index) => {
                        return <tr key={index}>
                            <td>{index + 1}</td>

                            <td>
                                {item.status === "Rejected" && <div className="status">
                                    <div className="rejected"></div>
                                    <div className="name">Bekor qilingan</div>
                                </div>}

                                {item.status === "check" && <div className="status">
                                    <div className="check"></div>
                                    <div className="name">Tasdiqlanmagan</div>
                                </div>}

                                {item.status === "Delivering" && <div className="status">
                                    <div className="Delivering"></div>
                                    <div className="name">Qabul qilingan</div>
                                </div>}

                                {item.status === "Active" && <div className="status">
                                    <div className="Active"></div>
                                    <div className="name">Faol</div>
                                </div>}

                                {item.status === "Delivered" && <div className="status">
                                    <div className="Delivered"></div>
                                    <div className="name">Yakunlangan</div>
                                </div>}
                            </td>


                            <td>
                                {item.get_client}
                            </td>
                            <td>{item.ordered_time}</td>
                            <td>{item.delivered_time}</td>
                            <td>
                                <div>
                                    <img onClick={() => {
                                        setCarInformation(item ? item : {})
                                        setModalShow(true)
                                    }} src="./images/admin/docs.png" alt=""/>
                                </div>
                            </td>
                        </tr>
                    })
                }
                </tbody>
            </table>
        </div>

        <div className="pagination">
            <div className="prev">
                <img onClick={() => {
                    if (activeItem > 1) {
                        getList(links.previous);
                        setActiveItem(activeItem - 1)
                    }
                }} src="./images/admin/prev.png" alt=""/>
            </div>

            {
                Pages.map((item, index) => {
                    return <div onClick={() => {
                        getList(item[index + 1])
                        setActiveItem(index + 1)
                    }} key={index} className={`items ${activeItem === index + 1 ? "active" : ""} `}>{index + 1}</div>
                })
            }

            <div onClick={() => {
                if (activeItem < Pages.length) {
                    getList(links.next)
                    setActiveItem(activeItem + 1)
                }
            }} className="next">
                <img src="./images/admin/next.png" alt=""/>
            </div>
        </div>

    </div>
};

export default Orders