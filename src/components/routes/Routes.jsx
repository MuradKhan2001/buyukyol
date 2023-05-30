import Admin from "../admin/Admin/Admin";
import Home from "../home/Home";
import AboutUs from "../about-us/AboutUs";
import Contact from "../contact/Contact";
import Agreement from "../agreement/Agreement";
import Service from "../service/service";
import Login from "../login/Login";
import MainHome from "../admin/admin home/MainHome";
import Balance from "../admin/balance/Balance";
import Driver from "../admin/driver/Driver";
import Safety from "../admin/safety/Safety";
import Partners from "../admin/partners/Partners";
import Orders from "../admin/orders/Orders";
import Payment from "../admin/payment/Payment";
import Customer from "../admin/customer/Customer";
import AddCar from "../admin/addcar/AddCar";
import AddBag from "../admin/addbag/AddBag";
import Notification from "../admin/notification/Notification";
import Direction from "../admin/direction/Direction";
import Aboutus from "../admin/Site Admin/aboutus/Aboutus";
import ContactA from "../admin/Site Admin/contact/ContactA";
import News from "../admin/Site Admin/news/News";
import ServiceA from "../admin/Site Admin/service/ServiceA";
import PartnersA from "../admin/Site Admin/partners/Partners";
import Moments from "../admin/Site Admin/moments/Moments";
import Hometext from "../admin/Site Admin/hometext/Hometext";
import Contract from "../admin/Site Admin/contract/Contract";
import Price from "../admin/price/Price";
import Message from "../admin/Site Admin/massages/Message";
import AddCars from "../admin/addcars/Addcars";
import Addprecent from "../admin/addprecent/Addprecent";



export const publicRoutes = [
    {
        path:"/",
        element:<Home/>
    },
    {
        path:"/about-us",
        element:<AboutUs/>
    },
    {
        path:"/contact",
        element:<Contact/>
    },
    {
        path:"/agreement",
        element:<Agreement/>
    },
    {
        path:"/service",
        element:<Service/>
    },
    {
        path:"/login-admin-buyukyol",
        element:<Login/>
    },
];

export const adminRoutes = [
    {
        path:"/*",
        element: <Admin/>
    },
];

export const adminPageRoutes = [
    {
        path:"/",
        element: <MainHome/>
    },
    {
        path:"/balance",
        element: <Balance/>
    },
    {
        path:"/driver",
        element: <Driver/>
    },
    {
        path:"/safety",
        element: <Safety/>
    },
    {
        path:"/partners",
        element: <Partners/>
    },
    {
        path:"/orders",
        element: <Orders/>
    },
    {
        path:"/payment",
        element: <Payment/>
    },
    {
        path:"/customer",
        element: <Customer/>
    },
    {
        path:"/addcar",
        element: <AddCar/>
    },
    {
        path:"/addbag",
        element: <AddBag/>
    },
    {
        path:"/notification",
        element: <Notification/>
    },
    {
        path:"/direction",
        element: <Direction/>
    },
    {
        path:"/aboutus",
        element: <Aboutus/>
    },
    {
        path:"/contacta",
        element: <ContactA/>
    },
    {
        path:"/news",
        element: <News/>
    },
    {
        path:"/servicea",
        element: <ServiceA/>
    },
    {
        path:"/partnersa",
        element: <PartnersA/>
    },
    {
        path:"/moments",
        element: <Moments/>
    },
    {
        path:"/hometext",
        element: <Hometext/>
    },
    {
        path:"/contract",
        element: <Contract/>
    },
    {
        path:"/price",
        element: <Price/>
    },
    {
        path:"/message",
        element: <Message/>
    },
    {
        path:"/addcars",
        element: <AddCars/>
    },
    {
        path:"/precent",
        element: <Addprecent/>
    }

];
