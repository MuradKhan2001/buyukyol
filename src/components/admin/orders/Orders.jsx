import "./orders.scss"
import {useContext, useEffect, useState} from "react";
import {MyContext} from "../../app/App";
import axios from "axios";


const Orders = () => {

    let value = useContext(MyContext);
    const [MainList, setMainList] = useState([]);
    const [MainListCount, setMainListCount] = useState("");
    const [Delivered, setDelivered]=useState(0);
    const [Active, setActive]=useState(0);
    const [Rejected, setRejected]=useState(0);
    const [links, setLinks]= useState({});
    const [Pages, setPages]= useState([]);

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
            if (response.data.Active){
                setActive(response.data.Active)
            }

            if (response.data.Delivered){
                setDelivered(response.data.Delivered)
            }

            if (response.data.Rejected){
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
                    <th>Mijoz</th>
                    <th>Yo'nalish</th>
                    <th>Yuk haqida</th>
                    <th>Narx</th>
                    <th>Hizmat haqqi</th>
                    <th>Haydovchi</th>
                    <th>Mashina turi</th>
                    <th>Berilgan sana</th>
                    <th>Tugatilgan sana</th>
                </tr>
                </thead>

                <tbody>
                {
                    MainList.map((item, index) => {
                        return <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                                {item.get_client}
                            </td>
                            <td>{item.direction}</td>
                            <td>
                                {item.info}
                            </td>
                            <td>{item.price}</td>
                            <td>{item.fee}</td>
                            <td>
                                {item.get_driver} <br/>
                            </td>
                            <td>
                                {item.vehicle} <br/>
                            </td>
                            <td>{item.ordered_time}</td>
                            <td>{item.delivered_time}</td>
                        </tr>
                    })
                }
                </tbody>
            </table>
        </div>

        <div className="pagination">
            <div className="prev">
                <img onClick={() => {
                    getList(links.previous)
                }} src="./images/admin/prev.png" alt=""/>
            </div>
            {
                Pages.map((item, index) => {
                    return <div onClick={() => {
                        getList(item[index + 1])
                        setActiveItem(index+1)
                    }} key={index} className={`items ${activeItem === index+1? "active" : ""} ` }>{index + 1}</div>
                })
            }

            <div onClick={() => {
                getList(links.next)
            }} className="next">
                <img src="./images/admin/next.png" alt=""/>
            </div>
        </div>

    </div>
};

export default Orders