import React from 'react'
import ReactDOM from 'react-dom/client'
import 'antd/dist/antd.min.css'
import './stylesheets/style.scss'
import reportWebVitals from './reportWebVitals'
import {renderRoutes} from 'react-router-config'
import {BrowserRouter} from 'react-router-dom'
import routes from './routes/Routes'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <BrowserRouter>
        {renderRoutes(routes)}
    </BrowserRouter>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
