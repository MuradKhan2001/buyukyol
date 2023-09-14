import "./active-orders.scss"
import {useEffect, useState} from "react";



const ActiveOrders = () => {

    const [MainList, setMainList] = useState([]);

    useEffect(() => {

        const websocket = new WebSocket(`wss://api.buyukyol.uz/ws/orders/Tashkent/uzbekistan/?token=${localStorage.getItem('token')}`);

        websocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if(data.message.orders){
                setMainList(data.message.orders);
            }
        };

    }, []);

    return <div className="orders-container">
        <div className="header-side">

        </div>
        <div className="orders-box">

            {
                MainList.map((item, index)=>{
                    return  <div key={index} className="order">
                        <div className="order-header">
                            {item.address_from} -  {item.address_to}
                        </div>

                        <div className="info">
                            <div className="item">
                                <div className="key-info">Yuk:</div>
                                <div className="info-text">{item.type}</div>
                            </div>

                            <div className="item">
                                <div className="key-info">Hajmi:</div>
                                <div className="info-text">{item.cargo}</div>
                            </div>

                            <div className="item">
                                <div className="key-info">Narxi:</div>
                                <div className="info-text">{item.capacity}</div>
                            </div>

                            <div className="item">
                                <div className="key-info">Masofa:</div>
                                <div className="info-text">{item.unit}</div>
                            </div>

                            <div className="item">
                                <div className="key-info">Avans:</div>
                                <div className="info-text">{item.price}</div>
                            </div>

                            <div className="item">
                                <div className="key-info">To'lov turi:</div>
                                <div className="info-text">{item.currency}</div>
                            </div>

                            <div className="item">
                                <div className="key-info">Kutish to'lovi:</div>
                                <div className="info-text">{item.distance}</div>
                            </div>
                        </div>
                        <div className="order-footer">
                            <div> { item.ordered_time.substring(0,10) } {item.ordered_time.substring(11,16) } </div>
                            <div className="btn-order">
                                <img src="./images/admin/tick.png" alt=""/>
                            </div>
                        </div>
                    </div>
                })
            }

        </div>

    </div>
};

export default ActiveOrders