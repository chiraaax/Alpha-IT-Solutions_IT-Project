import {createBrowserRouter} from "react-router-dom";
import App from "../App";

const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
        Children:[
            {
                path: '/',
                element: <h1>heading</h1>,
            },
        ],
    },
    
])

export default router;