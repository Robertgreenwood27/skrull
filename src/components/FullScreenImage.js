import React from 'react';
import ZoomLayer from './ZoomLayer';

const FullScreenImage = ({ selectedImage, zoomLevel, maxZoomLevel, onClose }) => (
    <div className="full-screen-container" onClick={onClose}>
        <img
            src={`${selectedImage}.png`}
            alt="Base image"
            className={`zoom-layer ${zoomLevel === 0 ? 'active' : ''}`}
        />
        {[...Array(maxZoomLevel).keys()].map(index => (
            <ZoomLayer key={index} selectedImage={selectedImage} zoomLevel={zoomLevel} index={index} />
        ))}
    </div>
);

export default FullScreenImage;
