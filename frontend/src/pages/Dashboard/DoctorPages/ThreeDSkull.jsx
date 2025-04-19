import React from "react";

import "./ThreeDSkull.css";
import ThreeDRenderSelector from "../../../utils/ThreeDRenderSelector";

const ThreeDSkull = () => {
    return (
        <div id="three-d-skull-container">
            <h2 id="three-d-skull-header">3D Skull</h2>
            <div id="three-d-skull-renders-container">
                <ThreeDRenderSelector />
            </div>
        </div>
    );
};

export default ThreeDSkull;
