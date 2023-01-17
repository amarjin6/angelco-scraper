import React from "react";
import {Filter} from "./pages/filterV2";
import {Filter as FilterV1} from "./pages/filterV1";
import {BrowserRouter, Route, Routes} from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Filter/>}/>
                <Route path="/v1" element={<FilterV1/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
