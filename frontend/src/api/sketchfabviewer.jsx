import React from "react";

const SketchfabViewer = ({
    title,
    modelId,
    width = "1300px",
    height = "500px",
}) => {
    return (
        <div className="sketchfab-embed-wrapper" style={{ width }}>
            <iframe
                title={title}
                frameBorder="0"
                allowFullScreen
                mozAllowFullScreen="true"
                webkitAllowFullScreen="true"
                allow="autoplay; fullscreen; xr-spatial-tracking"
                width={width}
                height={height}
                // ui_infos= '0'
                // ui_controls='0'
                // low_quality='1'
                src={`https://sketchfab.com/models/${modelId}/embed?camera=0`}
                style={{
                    borderRadius: "12px",
                }}
            />
        </div>
    );
};

export default SketchfabViewer;
