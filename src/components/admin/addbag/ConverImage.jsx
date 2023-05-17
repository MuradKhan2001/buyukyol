import "./add-bag.scss";
import {useState, useRef} from "react";
import * as htmlToImage from 'html-to-image';

const ConvertImage = () => {
    const [TruckWidth, setTruckWidth] = useState("");
    const [TruckHeight, setTruckHeight] = useState("");
    const domEl = useRef(null);

    const downloadImage = async () => {
        const dataUrl = await htmlToImage.toPng(domEl.current);
        // download image
        const link = document.createElement('a');
        link.download = "html-to-img.png";
        link.href = dataUrl;
        link.click();
    };


    return <div className="get-image-container">

        <button className="download-image" onClick={downloadImage}>Download Image</button>
        <div className="truck-image" id="domEl" ref={domEl}>

            <img src="../images/truck.jpg" width="100"/>

            <span className="width-truck">uzunligi- {TruckWidth}</span>
            <span className="height-truck">balandligi- {TruckHeight}</span>

        </div>

        <div className="inputs">
            <input onChange={(e) => setTruckWidth(e.target.value)} placeholder="Uzinlik" type="text"/>
            <input onChange={(e) => setTruckHeight(e.target.value)} placeholder="Balandlik" type="text"/>
        </div>

    </div>
};

export default ConvertImage