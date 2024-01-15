import React, { useEffect, useState } from 'react';

const ZoomComponent = ({ selectedImage, maxZoomLevel, setZoomLevel, zoomLevel, onBaseImageSwap }) => {
    const [lastZoomLevel, setLastZoomLevel] = useState(0); // State to keep track of the last zoom level

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

    // Function to swap the base image
    const swapBaseImage = () => {
        // Logic to select a new random base image
        // Example: Replace '3' with a random number within the valid range
        const newBaseImage = selectedImage.replace(/\d+/, () => Math.floor(Math.random() * 16) + 1);
        return newBaseImage;
    };

    // Effect to swap the base image when zooming out from the last zoom level
    useEffect(() => {
        if (zoomLevel < lastZoomLevel && lastZoomLevel === maxZoomLevel) {
            const newBaseImage = swapBaseImage();
            setZoomLevel(0); // Reset zoom level
            onBaseImageSwap(newBaseImage); // Call the callback function to update the base image in the parent component
        }
        setLastZoomLevel(zoomLevel);
    }, [zoomLevel, lastZoomLevel, maxZoomLevel, selectedImage, onBaseImageSwap]);

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
