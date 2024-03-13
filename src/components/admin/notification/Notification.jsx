import "./notification.scss";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../app/App";
import Driver from "../driver/Driver";
import axios from "axios";

const Notification = () => {
  let value = useContext(MyContext);
  const [sideNav, setSideNav] = useState(true);
  const [MainListDriver, setMainListDriver] = useState([]);
  const [MainListClient, setMainListClient] = useState([]);
  const [listDriver, setListDriver] = useState({
    title: "",
    title_ru: "",
    title_en: "",
    image: null,
    description: "",
    description_ru: "",
    description_en: "",
    receiver: "Driver",
  });
  const [listClient, setListClient] = useState({
    title: "",
    title_ru: "",
    title_en: "",
    image: null,
    description: "",
    description_ru: "",
    description_en: "",
    receiver: "Client",
  });

  const [editClient, setEditClient] = useState(false);
  const [editDriver, setEditDriver] = useState(false);
  const [editIndex, setEditIndex] = useState("");

  const getInputsDriver = (e) => {
    listDriver[e.target.name] = e.target.value;
  };

  function getImageDriver(e) {
    listDriver[e.target.name] = e.target.files[0];
  }

  const getInputsClient = (e) => {
    listClient[e.target.name] = e.target.value;
  };

  function getImageClient(e) {
    listClient[e.target.name] = e.target.files[0];
  }

  const getList = () => {
    axios
      .get(`${value.url}api/news/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        params: {
          user_type: "Driver",
        },
      })
      .then((response) => {
        setMainListDriver(response.data);
      })
      .catch((error) => {
        if (error.response.statusText == "Unauthorized") {
          window.location.pathname = "/";
          localStorage.removeItem("token");
        }
      });

    axios
      .get(`${value.url}api/news/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        params: {
          user_type: "Client",
        },
      })
      .then((response) => {
        setMainListClient(response.data);
      })
      .catch((error) => {
        if (error.response.statusText == "Unauthorized") {
          window.location.pathname = "/";
          localStorage.removeItem("token");
        }
      });
  };

  useEffect(() => {
    getList();
  }, []);

  const addList = (name) => {
    if (name === "driver") {
      if (
        listDriver.image &&
        listDriver.title.trim().length > 0 &&
        listDriver.title_ru.trim().length > 0 &&
        listDriver.title_en.trim().length > 0 &&
        listDriver.description.trim().length > 0 &&
        listDriver.description_ru.trim().length > 0 &&
        listDriver.description_en.trim().length > 0
      ) {
        let Post = new FormData();
        for (let key in listDriver) {
          Post.append(key, listDriver[key]);
        }

        axios
          .post(`${value.url}api/news/`, Post, {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          })
          .then(() => {
            getList();
            let newList = {
              title: "",
              title_ru: "",
              title_en: "",
              image: null,
              description: "",
              description_ru: "",
              description_en: "",
              receiver: "Driver",
            };
            setListDriver(newList);
            document.getElementById("titleDriver").value = "";
            document.getElementById("titleDriverRu").value = "";
            document.getElementById("titleDriverEn").value = "";
            document.getElementById("descriptionDriver").value = "";
            document.getElementById("descriptionDriverRu").value = "";
            document.getElementById("descriptionDriverEn").value = "";
            document.getElementById("photoDriver").value = "";
          })
          .catch(() => {});
      } else alert("Formani to'ldiring");
    }

    if (name === "client") {
      if (
        listClient.image &&
        listClient.title.trim().length > 0 &&
        listClient.title_ru.trim().length > 0 &&
        listClient.title_en.trim().length > 0 &&
        listClient.description.trim().length > 0 &&
        listClient.description_ru.trim().length > 0 &&
        listClient.description_en.trim().length > 0
      ) {
        let Post = new FormData();

        for (let key in listClient) {
          Post.append(key, listClient[key]);
        }

        axios
          .post(`${value.url}api/news/`, Post, {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          })
          .then(() => {
            getList();
            let newList = {
              title: "",
              title_ru: "",
              title_en: "",
              image: null,
              description: "",
              description_ru: "",
              description_en: "",
              receiver: "Client",
            };
            setListClient(newList);
            document.getElementById("titleClient").value = "";
            document.getElementById("titleClientRu").value = "";
            document.getElementById("titleClientEn").value = "";
            document.getElementById("descriptionClient").value = "";
            document.getElementById("descriptionClientRu").value = "";
            document.getElementById("descriptionClientEn").value = "";
            document.getElementById("photoClient").value = "";
          })
          .catch(() => {});
      } else alert("Formani to'ldiring");
    }
  };

  const delList = (id, name) => {
    if (name === "driver") {
      axios
        .delete(`${value.url}api/news/${id}/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          params: {
            user_type: "Driver",
          },
        })
        .then(() => {
          getList();
        })
        .catch(() => {});
    }

    if (name === "client") {
      axios
        .delete(`${value.url}api/news/${id}/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          params: {
            user_type: "Client",
          },
        })
        .then(() => {
          getList();
        })
        .catch(() => {});
    }
  };

  const editList1 = (ind, name, id) => {
    setEditIndex(id);
    if (name === "driver") {
      setEditDriver(true);
      let newList = {
        title: MainListDriver[ind].title,
        title_ru: MainListDriver[ind].title_ru,
        title_en: MainListDriver[ind].title_en,
        description: MainListDriver[ind].description,
        description_ru: MainListDriver[ind].description_ru,
        description_en: MainListDriver[ind].description_en,
        receiver: "Driver",
      };
      setListDriver(newList);
      document.getElementById("titleDriver").value = MainListDriver[ind].title;
      document.getElementById("titleDriverRu").value =
        MainListDriver[ind].title_ru;
      document.getElementById("titleDriverEn").value =
        MainListDriver[ind].title_en;
      document.getElementById("descriptionDriver").value =
        MainListDriver[ind].description;
      document.getElementById("descriptionDriverRu").value =
        MainListDriver[ind].description_ru;
      document.getElementById("descriptionDriverEn").value =
        MainListDriver[ind].description_en;
    }

    if (name === "client") {
      setEditClient(true);
      let newList = {
        title: MainListClient[ind].title,
        title_ru: MainListClient[ind].title_ru,
        title_en: MainListClient[ind].title_en,
        description: MainListClient[ind].description,
        description_ru: MainListClient[ind].description_ru,
        description_en: MainListClient[ind].description_en,
        receiver: "Client",
      };
      setListClient(newList);
      document.getElementById("titleClient").value = MainListClient[ind].title;
      document.getElementById("titleClientRu").value =
        MainListClient[ind].title_ru;
      document.getElementById("titleClientEn").value =
        MainListClient[ind].title_en;
      document.getElementById("descriptionClient").value =
        MainListClient[ind].description;
      document.getElementById("descriptionClientRu").value =
        MainListClient[ind].description_ru;
      document.getElementById("descriptionClientEn").value =
        MainListClient[ind].description_en;
    }
  };

  const editList2 = (name) => {
    if (name === "driver") {
      let Post = new FormData();
      for (let key in listDriver) {
        Post.append(key, listDriver[key]);
      }
      axios
        .patch(`${value.url}api/news/${editIndex}/`, Post, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          params: {
            user_type: "Driver",
          },
        })
        .then(() => {
          getList();
          setEditDriver(false);
          let newList = {
            title: "",
            title_ru: "",
            title_en: "",
            image: null,
            description: "",
            description_ru: "",
            description_en: "",
            receiver: "Driver",
          };
          setListDriver(newList);
          document.getElementById("titleDriver").value = "";
          document.getElementById("titleDriverRu").value = "";
          document.getElementById("titleDriverEn").value = "";
          document.getElementById("descriptionDriver").value = "";
          document.getElementById("descriptionDriverRu").value = "";
          document.getElementById("descriptionDriverEn").value = "";
          document.getElementById("photoDriver").value = "";
        })
        .catch(() => {});
    }

    if (name === "client") {
      let Post = new FormData();

      for (let key in listClient) {
        Post.append(key, listClient[key]);
      }

      axios
        .patch(`${value.url}api/news/${editIndex}/`, Post, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          params: {
            user_type: "Client",
          },
        })
        .then(() => {
          getList();
          setEditClient(false);
          let newList = {
            title: "",
            title_ru: "",
            title_en: "",
            image: null,
            description: "",
            description_ru: "",
            description_en: "",
            receiver: "Client",
          };
          setListClient(newList);
          document.getElementById("titleClient").value = "";
          document.getElementById("titleClientRu").value = "";
          document.getElementById("titleClientEn").value = "";
          document.getElementById("descriptionClient").value = "";
          document.getElementById("descriptionClientRu").value = "";
          document.getElementById("descriptionClientEn").value = "";
          document.getElementById("photoClient").value = "";
        })
        .catch(() => {});
    }
  };

  return (
    <div className="notification-container">
      <div className="header">
        <div
          onClick={() => {
            setSideNav(true);
            document.getElementById("titleClient").value = "";
            document.getElementById("titleClientRu").value = "";
            document.getElementById("titleClientEn").value = "";
            document.getElementById("descriptionClient").value = "";
            document.getElementById("descriptionClientRu").value = "";
            document.getElementById("descriptionClientEn").value = "";
            document.getElementById("photoClient").value = "";
          }}
          className={` sides ${sideNav ? "active" : ""}`}
        >
          Haydovchilar
        </div>
        <div
          onClick={() => {
            document.getElementById("titleDriver").value = "";
            document.getElementById("titleDriverRu").value = "";
            document.getElementById("titleDriverEn").value = "";
            document.getElementById("descriptionDriver").value = "";
            document.getElementById("descriptionDriverRu").value = "";
            document.getElementById("descriptionDriverEn").value = "";
            document.getElementById("photoDriver").value = "";
            setSideNav(false);
          }}
          className={` sides ${!sideNav ? "active" : ""}`}
        >
          Mijozlar
        </div>
      </div>

      {sideNav ? (
        <div className="content-card">
          <div className="left">
            <div className="inputs">
              <label htmlFor="photo">UZ:</label>
              <input
                name="title"
                id="titleDriver"
                onChange={getInputsDriver}
                placeholder="Sarlavha"
                type="text"
              />
              <textarea
                name="description"
                id="descriptionDriver"
                onChange={getInputsDriver}
                placeholder="Qisqacha ma'lumot uchun"
              ></textarea>

              <label htmlFor="photo">RU:</label>
              <input
                name="title_ru"
                id="titleDriverRu"
                onChange={getInputsDriver}
                placeholder="Заголовок"
                type="text"
              />
              <textarea
                name="description_ru"
                id="descriptionDriverRu"
                onChange={getInputsDriver}
                placeholder="Краткая информация"
              ></textarea>

              <label htmlFor="photo">EN:</label>
              <input
                name="title_en"
                id="titleDriverEn"
                onChange={getInputsDriver}
                placeholder="Title"
                type="text"
              />
              <textarea
                name="description_en"
                id="descriptionDriverEn"
                onChange={getInputsDriver}
                placeholder="Description"
              ></textarea>

              <label htmlFor="photo">Rasm:</label>
              <input
                name="image"
                onChange={getImageDriver}
                id="photoDriver"
                type="file"
              />
            </div>
            {editDriver ? (
              <div className="xbtns">
                <div onClick={() => editList2("driver")} className="add-button">
                  Tahrirlash
                </div>
                <div className="xbtn">
                  <img
                    onClick={() => {
                      setEditDriver(false);
                      let newList = {
                        title: "",
                        title_ru: "",
                        title_en: "",
                        image: null,
                        description: "",
                        description_ru: "",
                        description_en: "",
                        receiver: "Driver",
                      };
                      setListDriver(newList);
                      document.getElementById("titleDriver").value = "";
                      document.getElementById("titleDriverRu").value = "";
                      document.getElementById("titleDriverEn").value = "";
                      document.getElementById("descriptionDriver").value = "";
                      document.getElementById("descriptionDriverRu").value = "";
                      document.getElementById("descriptionDriverEn").value = "";
                    }}
                    src="../images/admin/close2.png"
                    alt=""
                  />
                </div>
              </div>
            ) : (
              <div className="xbtns">
                <div onClick={() => addList("driver")} className="add-button">
                  Qo'shish
                </div>
              </div>
            )}
          </div>

          <div className="right">
            {MainListDriver.map((item, index) => {
              return (
                <div key={index} className="cards">
                  <div className="for-img">
                    <img src={item.image} alt="" />
                  </div>

                  <div className="for-text">
                    <div className="title">
                      {localStorage.getItem("lng") === "uz" && item.title}

                      {localStorage.getItem("lng") === "ru" && item.title_ru}

                      {localStorage.getItem("lng") === "en" && item.title_en}
                    </div>
                    <div className="des">
                      {localStorage.getItem("lng") === "uz" && item.description}
                      {localStorage.getItem("lng") === "ru" &&
                        item.description_ru}
                      {localStorage.getItem("lng") === "en" &&
                        item.description_en}
                    </div>
                  </div>
                  <div className="for-btns">
                    <div>
                      <img
                        onClick={() => editList1(index, "driver", item.id)}
                        src="../images/admin/edit2.png"
                        alt=""
                      />
                    </div>
                    <div>
                      <img
                        onClick={() => delList(item.id, "driver")}
                        src="../images/admin/delete.png"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="content-card">
          <div className="left">
            <div className="inputs">
              <label htmlFor="photo">UZ:</label>
              <input
                name="title"
                id="titleClient"
                onChange={getInputsClient}
                placeholder="Sarlavha"
                type="text"
              />

              <textarea
                name="description"
                id="descriptionClient"
                onChange={getInputsClient}
                placeholder="Qisqacha ma'lumot uchun"
              ></textarea>

              <label htmlFor="photo">RU:</label>
              <input
                name="title_ru"
                id="titleClientRu"
                onChange={getInputsClient}
                placeholder="Заголовок"
                type="text"
              />
              <textarea
                name="description_ru"
                id="descriptionClientRu"
                onChange={getInputsClient}
                placeholder="Краткая информация"
              ></textarea>

              <label htmlFor="photo">En:</label>
              <input
                name="title_en"
                id="titleClientEn"
                onChange={getInputsClient}
                placeholder="Title"
                type="text"
              />
              <textarea
                name="description_en"
                id="descriptionClientEn"
                onChange={getInputsClient}
                placeholder="Description"
              ></textarea>

              <label htmlFor="photo">Rasm:</label>
              <input
                name="image"
                onChange={getImageClient}
                id="photoClient"
                type="file"
              />
            </div>
            {editClient ? (
              <div className="xbtns">
                <div onClick={() => editList2("client")} className="add-button">
                  Tahrirlash
                </div>
                <div className="xbtn">
                  <img
                    onClick={() => {
                      setEditClient(false);
                      let newList = {
                        title: "",
                        title_ru: "",
                        title_en: "",
                        image: null,
                        description: "",
                        description_ru: "",
                        description_en: "",
                        receiver: "Client",
                      };
                      setListClient(newList);
                      document.getElementById("titleClient").value = "";
                      document.getElementById("titleClientRu").value = "";
                      document.getElementById("titleClientEn").value = "";
                      document.getElementById("descriptionClient").value = "";
                      document.getElementById("descriptionClientRu").value = "";
                      document.getElementById("descriptionClientEn").value = "";
                      document.getElementById("photoClient").value = "";
                    }}
                    src="../images/admin/close2.png"
                    alt=""
                  />
                </div>
              </div>
            ) : (
              <div className="xbtns">
                <div onClick={() => addList("client")} className="add-button">
                  Qo'shish
                </div>
              </div>
            )}
          </div>

          <div className="right">
            {MainListClient.map((item, index) => {
              return (
                <div key={index} className="cards">
                  <div className="for-img">
                    <img src={item.image} alt="" />
                  </div>

                  <div className="for-text">
                    <div className="title">
                      {localStorage.getItem("lng") === "uz" && item.title}

                      {localStorage.getItem("lng") === "ru" && item.title_ru}

                      {localStorage.getItem("lng") === "en" && item.title_en}
                    </div>
                    <div className="des">
                      {localStorage.getItem("lng") === "uz" && item.description}
                      {localStorage.getItem("lng") === "ru" &&
                        item.description_ru}
                      {localStorage.getItem("lng") === "en" &&
                        item.description_en}
                    </div>
                  </div>
                  <div className="for-btns">
                    <div>
                      <img
                        onClick={() => editList1(index, "client", item.id)}
                        src="../images/admin/edit2.png"
                        alt=""
                      />
                    </div>
                    <div>
                      <img
                        onClick={() => delList(item.id, "client")}
                        src="../images/admin/delete.png"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
