import React from "react"
import "./assets/less/index.less"
import ReactDOM from "react-dom/client"
import App from "./App"
import {BrowserRouter} from "react-router-dom"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
    // <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    // </React.StrictMode>
)
