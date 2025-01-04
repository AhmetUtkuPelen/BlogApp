import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux';
import {persistor, store} from '../Redux/Store.ts';
import { PersistGate } from 'redux-persist/integration/react';
import Theme from './Components/Theme';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';



axios.defaults.baseURL = 'http://localhost:5555';
axios.defaults.withCredentials = true;



createRoot(document.getElementById('root')!).render(

  <PersistGate persistor={persistor}>
      <ToastContainer 
    position="top-right"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="light"
  />
  <Provider store={store}>
    <Theme>
      <App />
    </Theme>
  </Provider>
  </PersistGate>,

)