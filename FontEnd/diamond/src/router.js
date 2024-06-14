import UserLogin from "./asset/user/login/userLogin"
import {  ROUTERS } from "./utils/router"
import { Route, Routes } from "react-router-dom";
import MasterLayout from "./pages/user/MasterLayout";

import HomePage from "./pages/user/Home/homePage";
import ServiceBody from "./pages/user/Service/ServiceBody";
import Blog from "./pages/user/Blog/Blog";
import EDUCATION_CARAT from "./pages/user/Education/Carat";
import EDUCATION_CUT from "./pages/user/Education/Cut";
import EDUCATION_FLUORESCENCE from "./pages/user/Education/Fluorescence";
import EDUCATION_CLARITY from "./pages/user/Education/Clarity";
import EDUCATION_COLOR from "./pages/user/Education/Color";
import Diamond from "./pages/user/Diamond/Diamod";
import Contact from "./pages/user/Contact/Contact";
import Sign from "./asset/user/sign/Sign";
import Blog1 from "./pages/user/Blog/BlogContent/Blog1";
import Blog2 from "./pages/user/Blog/BlogContent/Blog2";
import Blog3 from "./pages/user/Blog/BlogContent/Blog3";
import Blog4 from "./pages/user/Blog/BlogContent/Blog4";
import Blog5 from "./pages/user/Blog/BlogContent/Blog5";
import CalculatorService from "./pages/user/Service/CalculatorService";





const renderUserRouter = () => {
    const userRouters = [
        //USER-LOGIN
        {
            path : ROUTERS.USER.LOGIN,
            component: <UserLogin/>
        },
        //USER-SIGN
        {
            path : ROUTERS.USER.SIGN,
            component: <Sign/>
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