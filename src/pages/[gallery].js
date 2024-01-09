import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSwipeable } from 'react-swipeable';

const GalleryPage = () => {
    const router = useRouter();
    const { gallery } = router.query;
    const [shuffledImages, setShuffledImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null); // State to track the selected image
    const [zoomLevel, setZoomLevel] = useState(0); // State to track zoom level
    const [loadMore, setLoadMore] = useState({ top: false, bottom: false });
    const maxZoomLevel = 4;
    const [initialTouchY, setInitialTouchY] = useState(null);
    const [touchMoveY, setTouchMoveY] = useState(null);

    const handleTouchStart = (event) => {
        // Store the initial touch Y position
        setInitialTouchY(event.touches[0].clientY);
    };

    const handleTouchMove = (event) => {
        // Update the touch move Y position
        setTouchMoveY(event.touches[0].clientY);

        // Determine the direction and length of the swipe
        const deltaY = initialTouchY - touchMoveY;

        // A threshold to determine if it's a zoom gesture (you can adjust this value)
        const zoomThreshold = 30;

        if (Math.abs(deltaY) > zoomThreshold) {
            // Zooming logic
            if (deltaY > 0) {
                // Swiping up, zoom out
                setZoomLevel(prevZoomLevel => Math.max(prevZoomLevel - 1, 0));
            } else {
                // Swiping down, zoom in
                setZoomLevel(prevZoomLevel => Math.min(prevZoomLevel + 1, maxZoomLevel));
            }

            event.preventDefault(); // Prevent scrolling when zooming
        }
        // If deltaY is within the threshold, it will be treated as a scroll, and the default behavior will occur
    };

    const handleTouchEnd = (event) => {
        // Reset touch positions
        setInitialTouchY(null);
        setTouchMoveY(null);
    };

    // Shuffle the array of images
    const shuffleArray = array => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    // Load and shuffle images when the gallery changes
    useEffect(() => {
        if (gallery) {
            const folderName = gallery.slice(0, -1);
            setShuffledImages(shuffleArray([...Array(16).keys()].map(k => `/${folderName}/${folderName}${k + 1}.png`)));
        }
    }, [gallery]);

    // Handle infinite scroll loading
    const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 10) {
            setLoadMore(prev => ({ ...prev, bottom: true }));
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!loadMore.bottom) return;
        const folderName = gallery.slice(0, -1);
        const newImages = shuffleArray([...Array(16).keys()].map(k => `/${folderName}/${folderName}${k + 1}.png`));
        setShuffledImages(prevImages => [...prevImages, ...newImages]);
        setLoadMore({ top: false, bottom: false });
    }, [loadMore, gallery]);

  // Function to open an image in full screen
  const openImage = (image) => {
    // Extract the base image path without the zoom level
    const baseImagePath = image.includes('/') ? image.split('/')[2].split('.')[0] : image.split('.')[0];
    setSelectedImage(`/skull/${baseImagePath}`);
    setZoomLevel(0); // Reset zoom level when a new image is opened
};

    // Function to close the full screen view
    const closeFullScreen = () => {
        setSelectedImage(null);
    };

    const handleScrollZoom = (event) => {
        if (selectedImage) {
            if (event.deltaY > 0) {
                // Scroll down (finger moves up), zoom out
                setZoomLevel(prevZoomLevel => (prevZoomLevel > 0 ? prevZoomLevel - 1 : prevZoomLevel));
            } else {
                // Scroll up (finger moves down), zoom in
                setZoomLevel(prevZoomLevel => (prevZoomLevel < maxZoomLevel ? prevZoomLevel + 1 : prevZoomLevel));
            }
        }
    };
    

    useEffect(() => {
        window.addEventListener('wheel', handleScrollZoom);

        return () => {
            window.removeEventListener('wheel', handleScrollZoom);
        };
    }, [selectedImage, maxZoomLevel]);

    // Swipe handler for right swipe
    const handlers = useSwipeable({
        onSwipedRight: () => router.push('/'),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true,
    });

    if (selectedImage) {
        return (
            <div className="full-screen-container" onClick={closeFullScreen}>
                {/* Display the base image */}
                <img
                    src={`${selectedImage}.png`}
                    alt="Base image"
                    className={`zoom-layer ${zoomLevel === 0 ? 'active' : ''}`}
                />
                {/* Display zoom layers */}
                {[...Array(maxZoomLevel).keys()].map(index => {
                    // Keep each less zoomed-in image visible longer during zoom-in
                    const isActive = zoomLevel > index;
                    return (
                        <img
                            key={index}
                            src={`${selectedImage}${String.fromCharCode(97 + index)}.png`} // e.g., skull4a.png, skull4b.png, etc.
                            alt={`Zoom level ${index + 1}`}
                            className={`zoom-layer ${isActive ? 'active' : ''}`}
                            style={{ transform: `translate(-50%, -50%) scale(${Math.pow(2, index + 1 - zoomLevel)})` }}
                        />
                    );
                })}
            </div>
        );
    }
    

    return (
        <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="swipe-handler"
        >
            {/* Gallery Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
                {shuffledImages.map((image, index) => (
                    <img key={index} src={image} alt={`Image ${index + 1}`} 
                         className="w-full h-auto object-cover" 
                         onClick={() => openImage(image)} />
                ))}
            </div>
        </div>
    );
};

export default GalleryPage;