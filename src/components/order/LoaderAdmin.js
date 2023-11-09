import "./loaderMap.scss";
import {useTranslation} from "react-i18next";


const LoaderAdmin = ()=>{
    const {t} = useTranslation();

    return <div className="loader-admin">
        <div className="mirror">
            <div className="lds-spinner">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>

            <div className="text">
                {t("map")}
            </div>
        </div>
    </div>
};

export default LoaderAdmin