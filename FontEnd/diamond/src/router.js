import UserLogin from "./pages/login/userLogin"
import {  ROUTERS } from "./utils/router"
import { Route, Routes } from "react-router-dom";
import MasterLayout from "./pages/MasterLayout";
import "react-bootstrap/dist/react-bootstrap.min.js"
import 'bootstrap/dist/css/bootstrap.min.css';

import HomePage from "./pages/Home/homePage";
import ServiceBody from "./pages/Service/ServiceBody";
import Blog from "./pages/Blog/Blog";
import EDUCATION_CARAT from "./pages/Education/Carat";
import EDUCATION_CUT from "./pages/Education/Cut";
import EDUCATION_FLUORESCENCE from "./pages/Education/Fluorescence";
import EDUCATION_CLARITY from "./pages/Education/Clarity";
import EDUCATION_COLOR from "./pages/Education/Color";
import Diamond from "./pages/Diamond/Diamond";
import Contact from "./pages/Contact/Contact";
import Blog1 from "./pages/Blog/BlogContent/Blog1";
import Blog2 from "./pages/Blog/BlogContent/Blog2";
import Blog3 from "./pages/Blog/BlogContent/Blog3";
import Blog4 from "./pages/Blog/BlogContent/Blog4";
import Blog5 from "./pages/Blog/BlogContent/Blog5";
import CalculatorService from "./pages/Service/CalculatorService";
import Signup from "./pages/Signup/Signup";





const renderUserRouter = () => {
    const userRouters = [
        //USER-LOGIN
        {
            path : ROUTERS.USER.LOGIN,
            component: <UserLogin/>
        },
        //USER-SIGN
        {
            path : ROUTERS.USER.SIGNUP,
            component: <Signup/>
        },
        //USER-HOMEPAGE
        {
            path : ROUTERS.USER.HOME,
            component: <HomePage/>
        },
        //USER-SERVICE
        {
            path : ROUTERS.USER.SERVICE_VALUATION,
            component: <ServiceBody/>
        },
        {
            path : ROUTERS.USER.SERVICE_CALCULATOR,
            component: <CalculatorService/>
        },
        {
            path : ROUTERS.USER.SERVICE_SCULPTURE,
            component: <ServiceBody/>
        },
        {
            path : ROUTERS.USER.SERVICE_SALE,
            component: <ServiceBody/>
        },
        //BLOG
        {
            path : ROUTERS.USER.BLOG,
            component: <Blog/>
        },
        {
            path : ROUTERS.USER.BLOG_POST1,
            component: <Blog1/>
        },
        {
            path : ROUTERS.USER.BLOG_POST2,
            component: <Blog2/>
        },
        {
            path : ROUTERS.USER.BLOG_POST3,
            component: <Blog3/>
        },
        {
            path : ROUTERS.USER.BLOG_POST6,
            component: <Blog4/>
        },
        {
            path : ROUTERS.USER.BLOG_POST7,
            component: <Blog5/>
        },
        //EDUCATION:
        {
            path : ROUTERS.USER.EDUCATION_CARAT,
            component: <EDUCATION_CARAT/>
        },
        {
            path : ROUTERS.USER.EDUCATION_CUT,
            component: <EDUCATION_CUT/>
        },
        {
            path : ROUTERS.USER.EDUCATION_COLOR,
            component: <EDUCATION_COLOR/>
        },
        {
            path : ROUTERS.USER.EDUCATION_CLARITY,
            component: <EDUCATION_CLARITY/>
        },
        {
            path : ROUTERS.USER.EDUCATION_FLUORESCENCE,
            component: <EDUCATION_FLUORESCENCE/>
        },
        //DIAMOND
        {
            path : ROUTERS.USER.DIAMOND,
            component: <Diamond/>
        },
        //CONTACT
        {
            path : ROUTERS.USER.CONTACT,
            component: <Contact/>
        }
    ]

    return (
        <MasterLayout>

        <Routes>
            {
                userRouters.map((item, key) =>(
                    <Route key ={key} path={item.path} element={item.component} />
                ))
            }
        </Routes>
        </MasterLayout>

    )
}

const RouterCustom = () => {
    return renderUserRouter()
}


export default RouterCustom;