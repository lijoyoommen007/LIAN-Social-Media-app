import React from 'react';
import ReactDOM from 'react-dom/client';
import "./index.css"
import App from './App';
import { QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { DarkModeContextProvider } from './context/darkModeContext';
import {AuthContextProvider} from './context/AuthContext'
import { Provider } from 'react-redux';
import {store} from '../src/music player/redux/store'
const queryClient = new QueryClient()
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
    <Provider store={store}>
      <AuthContextProvider>
      <QueryClientProvider client={queryClient}>
        <DarkModeContextProvider>
        <App />
    </DarkModeContextProvider>
    </QueryClientProvider>
    </AuthContextProvider>
    </Provider>
    

);
