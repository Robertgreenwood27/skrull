import React, { useEffect } from 'react';

const ZoomComponent = ({ selectedImage, maxZoomLevel, setZoomLevel, zoomLevel }) => {
    const handleScrollZoom = (event) => {
        if (selectedImage) {
            const zoomingIn = event.deltaY < 0;
            setZoomLevel(prevZoomLevel => {
                if (zoomingIn) {
                    return Math.min(prevZoomLevel + 1, maxZoomLevel);
                } else {
                    return Math.max(prevZoomLevel - 1, 0);
                }
            });
            event.preventDefault();
        }
    };

    useEffect(() => {
        window.addEventListener('wheel', handleScrollZoom);
        return () => {
            window.removeEventListener('wheel', handleScrollZoom);
        };
    }, [selectedImage, maxZoomLevel, zoomLevel]);

    return (
        <div className="full-screen-container">
            {/* Display the base image */}
            <img
                src={`${selectedImage}.png`}
                alt="Base image"
                className={`zoom-layer ${zoomLevel === 0 ? 'active' : ''}`}
            />
            {/* Display zoom layers */}
            {[...Array(maxZoomLevel).keys()].map(index => {
                const isActive = zoomLevel > index;
                return (
                    <img
                        key={index}
                        src={`${selectedImage}${String.fromCharCode(97 + index)}.png`}
                        alt={`Zoom level ${index + 1}`}
                        className={`zoom-layer ${isActive ? 'active' : ''}`}
                        style={{
                            transform: `translate(-50%, -50%) scale(${Math.pow(2, index + 1 - zoomLevel)})`,
                            touchAction: 'none'
                        }}
                    />
                );
            })}
        </div>
    );
};

export default ZoomComponent;
