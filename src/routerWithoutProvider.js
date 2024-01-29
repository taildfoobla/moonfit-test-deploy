import React from "react"
import { Route, Routes } from "react-router-dom"
import RedirectEvent from "./pages/RedirectEvent/components"

const routerWithoutProvider = (
    <Routes>
        <Route path="/discord" element={<RedirectEvent />} />
        <Route path="/twitter" element={<RedirectEvent />} />
    </Routes>
)

export default routerWithoutProvider
