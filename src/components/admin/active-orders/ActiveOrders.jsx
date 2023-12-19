import "./active-orders.scss"
import {useEffect, useState} from "react";


const ActiveOrders = () => {
    let websocket= null
    const [MainList, setMainList] = useState([]);

    useEffect(() => {
        if (!localStorage.getItem("token")) return () => {}

        navigator.geolocation.getCurrentPosition((position) => {
            const {latitude, longitude} = position.coords;
            const location = `${latitude}/${longitude}`;
            websocket = new WebSocket(`wss://api.buyukyol.uz/ws/orders/${location}/?token=${localStorage.getItem("token")}`);

            websocket.onclose = () => {
                window.location.reload()
            }
            websocket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.message.orders) {
                    setMainList(data.message.orders);
                }
            };
            websocket.onopen = ()=>{
                console.log("opn")
            }

        },(error) => {
            alert("Geolakatsiyani yoqing!")
        });

    }, []);

    const RejectOrder = (id) => {
        websocket.send(JSON.stringify({command: "reject_order", order_id: id}))
        websocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.message.orders) {
                setMainList(data.message.orders);
            }
        };
    };

    return <div className="orders-container">
        <div className="header-side">

        </div>
        <div className="orders-box">

            {
                MainList.map((item, index) => {
                    return <div key={index} className="order">
                        <div className="order-header">
                            <div>
                                <img src="./images/admin/location2.png" alt=""/>
                                {item.address_from}
                            </div>

                            <div>
                                <img src="./images/admin/location1.png" alt=""/>
                                {item.address_to}
                            </div>
                        </div>
                        <div className="info">
                            <div className="item">
                                <div className="key-info">Kategoriya:</div>
                                <div className="info-text">{item.type}</div>
                            </div>

                            <div className="item">
                                <div className="key-info">Moshina turi:</div>
                                <div className="info-text">{item.car_category.name}</div>
                            </div>

                            <div className="item">
                                <div className="key-info">Kuzov turi:</div>
                                <div className="info-text">{item.car_body_type.name}</div>
                            </div>

                            <div className="item">
                                <div className="key-info">Yuk nomi:</div>
                                <div className="info-text">{item.cargo}</div>
                            </div>


                            <div className="item">
                                <div className="key-info">Hajmi:</div>
                                <div className="info-text">{item.capacity}</div>
                            </div>

                            <div className="item">
                                <div className="key-info">Narxi:</div>
                                <div className="info-text">{item.price}</div>
                            </div>

                            <div className="item">
                                <div className="key-info">Masofa:</div>
                                <div className="info-text">{item.distance} km</div>
                            </div>

                            <div className="item">
                                <div className="key-info">Avans:</div>
                                <div className="info-text">{item.avans}</div>
                            </div>

                            <div className="item">
                                <div className="key-info">To'lov turi:</div>
                                <div className="info-text">{item.currency}</div>
                            </div>
                        </div>
                        <div className="order-footer">
                            <div> {item.ordered_time.substring(0, 10)},  {item.ordered_time.substring(11, 16)} </div>

                            <div className="btn-order">
                                Bekor qilish
                                <img onClick={() => RejectOrder(item.id)} src="./images/admin/close.png" alt=""/>
                            </div>
                        </div>
                    </div>
                })
            }

        </div>

    </div>
};

export default ActiveOrders