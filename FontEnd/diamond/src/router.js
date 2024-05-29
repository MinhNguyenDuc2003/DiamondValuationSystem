import UserLogin from "./asset/user/login/userLogin"
import {  ROUTERS } from "./utils/router"
import { Route, Routes } from "react-router-dom";
import MasterLayout from "./pages/user/MasterLayout";

import HomePage from "./pages/user/Home/homePage";
import ServiceBody from "./pages/user/Service/ServiceBody";
import Blog from "./pages/user/Blog/Blog";
import Education from "./pages/user/Education/Education";
import Diamond from "./pages/user/Diamond/Diamod";
import Contact from "./pages/user/Diamond copy/Contact";
import Sign from "./asset/user/sign/Sign";





const renderUserRouter = () => {
    const userRouters = [
        {
            path : ROUTERS.USER.LOGIN,
            component: <UserLogin/>
        },
        {
            path : ROUTERS.USER.SIGN,
            component: <Sign/>
        },
        {
            path : ROUTERS.USER.HOME,
            component: <HomePage/>
        },
        {
            path : ROUTERS.USER.SERVICE,
            component: <ServiceBody/>
        },
        {
            path : ROUTERS.USER.BLOG,
            component: <Blog/>
        },
        {
            path : ROUTERS.USER.EDUCATION,
            component: <Education/>
        },
        {
            path : ROUTERS.USER.DIAMOND,
            component: <Diamond/>
        },
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