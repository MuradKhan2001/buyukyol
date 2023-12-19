import "./adminHome.scss"
import {useEffect, useMemo, useState} from "react"
import {GoogleMap, useLoadScript, Marker, InfoWindow} from "@react-google-maps/api";
import LoaderAdmin from "./LoaderAdmin";

const API_KEY = "AIzaSyAT1gB8sob8_piFwfeu3AaTL15yHyjuc30";

const MainHome = () => {

    const [locationsList, setLocationsList] = useState([]);

    useEffect(() => {
        if (!localStorage.getItem("token")) return () => {}

        navigator.geolocation.getCurrentPosition((position) => {
            const {latitude, longitude} = position.coords;
            const location = `${latitude}/${longitude}`;
            const websocket = new WebSocket(`wss://api.buyukyol.uz/ws/orders/${location}/?token=${localStorage.getItem("token")}`);

            websocket.onclose = () => {
                window.location.reload()
            }
            websocket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.message.drivers) {
                    setLocationsList(data.message.drivers)
                }
            };

        },(error) => {
           alert("Geolakatsiyani yoqing!")
        });

        if (sessionStorage.getItem("style")) {
        } else sessionStorage.setItem("style", "51da2328145a4757");

    }, []);

    const [selectedLocation, setSelectedLocation] = useState(null);

    const onMarkerClick = (location) => {
        setSelectedLocation(location);
    };

    const onCloseClick = () => {
        setSelectedLocation(null);
    };

    const {isLoaded} = useLoadScript({
        googleMapsApiKey: API_KEY
    });

    const center = useMemo(() => ({lat: 41, lng: 65}), []);

    const options = useMemo(() => (
        {
            mapId: sessionStorage.getItem("style"),
            disableDefaultUI: false,
            clickableIcons: false
        }), []);

    if (!isLoaded) return <LoaderAdmin/>;

    const icon = {url: './images/admin/truck-icon2.png', scaledSize: {width: 45, height: 45}};

    return <div className="admin-home-container">
        <div className="icon-dark-mode">
            {
                sessionStorage.getItem("style") == "51da2328145a4757" ? <img onClick={() => {
                    sessionStorage.setItem("style", "e673b14776ad9118");
                    window.location.reload();
                }} src="./images/admin/dark.png" alt=""/> : ""
            }
            {
                sessionStorage.getItem("style") == "e673b14776ad9118" ? <img onClick={() => {
                    sessionStorage.setItem("style", "51da2328145a4757")
                    window.location.reload()
                }} src="./images/admin/mode.png" alt=""/> : ""
            }
        </div>

        <GoogleMap

            zoom={5}
            center={center}
            options={options}
            mapContainerClassName="map-container">

            {locationsList.length >= 0 ?

                <>
                    {locationsList.map((item) => {
                        return <Marker
                            key={Number(item.latitude)}
                            position={{lat: Number(item.latitude), lng: Number(item.longitude)}}
                            icon={icon}
                            onClick={() => onMarkerClick(item)}
                        />
                    })}

                    {selectedLocation && (
                        <InfoWindow
                            position={{
                                lat: Number(selectedLocation.latitude),
                                lng: Number(selectedLocation.longitude)
                            }}
                            onCloseClick={onCloseClick}
                        >
                            <div className="info-box">
                                <div className="info-text">
                                    <span>Moshina raqam:</span>
                                    {selectedLocation.car_number} <br/>
                                    <span>Tel raqam:</span>
                                    {selectedLocation.phone_number}
                                </div>
                            </div>
                        </InfoWindow>
                    )}
                </>

                : ""
            }


        </GoogleMap>
    </div>
};


export default MainHome