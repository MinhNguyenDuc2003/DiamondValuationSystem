import UserLogin from "./asset/user/login/userLogin"
import {  ROUTERS } from "./utils/router"
import { Route, Routes } from "react-router-dom";
import MasterLayout from "./pages/user/MasterLayout";

import HomePage from "./pages/user/Home/homePage";



const renderUserRouter = () => {
    const userRouters = [
        {
            path : ROUTERS.USER.LOGIN,
            component: <UserLogin/>
        },
        {
            path : ROUTERS.USER.HOME,
            component: <HomePage/>
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