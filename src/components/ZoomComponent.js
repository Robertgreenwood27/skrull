import React, { useEffect, useState } from 'react';

const ZoomComponent = ({ selectedImage, maxZoomLevel, setZoomLevel, zoomLevel }) => {
    const [initialTouchY, setInitialTouchY] = useState(null);
    const [initialTouchTime, setInitialTouchTime] = useState(null);
    const [zoomActionTaken, setZoomActionTaken] = useState(false);

    // Handle mouse wheel zoom
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

    // Handle touch start
    const handleTouchStart = (event) => {
        setInitialTouchY(event.touches[0].clientY);
        setInitialTouchTime(Date.now());
    };

    // Handle touch move
    const handleTouchMove = (event) => {
        if (zoomActionTaken) return;
        event.preventDefault();
        const touchMoveY = event.touches[0].clientY;
        const deltaY = initialTouchY - touchMoveY;
        const touchDuration = Date.now() - initialTouchTime;

        const zoomThreshold = 30;
        const timeThreshold = 150; // milliseconds

        if (Math.abs(deltaY) > zoomThreshold && touchDuration > timeThreshold) {
            setZoomActionTaken(true);
            if (deltaY > 0) {
                // Swiping up, zoom in
                setZoomLevel(prevZoomLevel => Math.min(prevZoomLevel + 1, maxZoomLevel));
            } else {
                // Swiping down, zoom out
                setZoomLevel(prevZoomLevel => Math.max(prevZoomLevel - 1, 0));
            }
        }
    };

    // Handle touch end
    const handleTouchEnd = () => {
        setInitialTouchY(null);
        setInitialTouchTime(null);
        setZoomActionTaken(false);
    };

    useEffect(() => {
        window.addEventListener('wheel', handleScrollZoom);
        return () => {
            window.removeEventListener('wheel', handleScrollZoom);
        };
    }, [selectedImage, maxZoomLevel, zoomLevel]);

    return (
        <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="full-screen-container"
        >
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
