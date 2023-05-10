import "./style.scss"

const Hometext = () =>{
    return <div className="hometext-admin-box">
        <div className="content-card">
            <div className="left">

                <div className="inputs">
                    <input placeholder="Katta text" type="text"/>
                    <input placeholder="Kichkina text" type="text"/>
                </div>
                <div className="add-button">Qo'shish</div>

            </div>

            <div className="right">
                <div className="cards">
                    <div className="for-text">
                        <div className="title">Assalomu laykum</div>
                        <div className="title">Buyuk yol platformasiga xush kelibsiz</div>
                    </div>
                    <div className="for-btns">
                        <div>
                            <img src="../images/admin/edit2.png" alt=""/>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    </div>
};

export default Hometext