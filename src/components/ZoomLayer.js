import React from 'react';

const ZoomLayer = ({ selectedImage, zoomLevel, index }) => {
    const isActive = zoomLevel > index;
    return (
        <img
            src={`${selectedImage}${String.fromCharCode(97 + index)}.png`}
            alt={`Zoom level ${index + 1}`}
            className={`zoom-layer ${isActive ? 'active' : ''}`}
            style={{
                transform: `translate(-50%, -50%) scale(${Math.pow(2, index + 1 - zoomLevel)})`,
                touchAction: 'none'
            }}
        />
    );
};

export default ZoomLayer;
