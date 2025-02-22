import "./active-orders.scss"
import {useEffect, useState} from "react";


const ActiveOrders = () => {

    const [sockedContext, setSockedContext] = useState(null);
    const [MainList, setMainList] = useState([]);

    useEffect(() => {
        if (!localStorage.getItem("token")) return () => {
        }

        const websocket = new WebSocket(`wss://api.buyukyol.uz/ws/orders/?token=${localStorage.getItem("token")}`);

        setSockedContext(websocket);

        websocket.onclose = () => {
            window.location.reload()
        }

    }, []);

    useEffect(() => {
        setSockedContext(websocket => {
            if (!websocket) return null

            websocket.onmessage = (event) => {

                const data = JSON.parse(event.data);

                if (data.message.status) {
                    if (data.message.status === "canceled") {

                    }
                }

                if (data.message.orders) {
                    setMainList(data.message.orders);
                }
            };

            return websocket
        })

    }, [sockedContext])

    const RejectOrder = (id) => {
        const result = window.confirm(" Buyurtmani o'chirmoqchimisiz? ");

        if (result) {
            sockedContext.send(JSON.stringify({command: "reject_order", order_id: id}))

            sockedContext.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.message.orders) {
                    setMainList(data.message.orders);
                }
            };
        }
    };

    return <div className="active-orders-container">
        <div className="table-content">
            <table>
                <thead>
                <tr>
                    <th>№</th>
                    <th>Yonalish</th>
                    <th>Mijoz</th>
                    <th>Yuk haqida</th>
                    <th>Yo'nalish</th>
                    <th>Narx</th>
                    <th>Mashina turi</th>
                    <th>Masofa</th>
                    <th>Avans</th>
                    <th>Buyurtma berilgan vaqt</th>
                    <th>Bekor qilish</th>
                </tr>
                </thead>

                <tbody>
                {
                    MainList.map((item, index) => {
                        return <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                                {item.type}
                            </td>
                            <td>
                                {item.client.first_name} &ensp;
                                {item.client.last_name} <br/>
                                {item.client.phone}
                            </td>

                            <td>
                                <b><i> {item.cargo}</i></b> <br/>
                                {item.capacity} kg
                            </td>
                            <td>
                                {item.address_from}
                                <hr/>
                                {item.address_to}
                            </td>
                            <td>
                                {item.price} {item.currency}
                            </td>
                            <td>
                                {item.car_body_type.name} / {item.car_body_type.cargo_weight}
                            </td>
                            <td>
                                {item.distance} km
                            </td>
                            <td>
                                {item.avans} <br/> {item.currency}
                            </td>
                            <td>
                                {item.ordered_time}
                            </td>
                            <td>
                                <div>
                                    <img onClick={()=> RejectOrder(item.id)}  src="./images/admin/cancel-order.png" alt=""/>
                                </div>
                            </td>
                        </tr>
                    })
                }

                </tbody>
            </table>
        </div>
    </div>
};

export default ActiveOrders