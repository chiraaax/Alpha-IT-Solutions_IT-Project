import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import store from './redux/store.js';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import router from './routers/Router.jsx';

createRoot(document.getElementById('root')).render(
  <Provider store={store}> {/* Wrap App with Provider and pass the store */}
    <RouterProvider router={router}/>
  </Provider>
);

