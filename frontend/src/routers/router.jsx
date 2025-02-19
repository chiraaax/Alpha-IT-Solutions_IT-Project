import {createBrowserRouter} from "react-router-dom";
import App from "../App";

const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
        Children:[
            {
                path: '/',
                element: <div>Home page</div>,
            },
            {
                path: '/about',
                element: <div>About page</div>,
            },
        ],
    },

])

export default router;