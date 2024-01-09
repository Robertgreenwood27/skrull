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
    const [initialTouchTime, setInitialTouchTime] = useState(null);

    const handleTouchStart = (event) => {
        if (shouldDisablePullToRefresh()) {
            event.preventDefault();
        }
        setInitialTouchY(event.touches[0].clientY);
        setInitialTouchTime(Date.now());
    };

    const handleTouchMove = (event) => {
        if (shouldDisablePullToRefresh()) {
            event.preventDefault();
        }
        const touchMoveY = event.touches[0].clientY;
        const deltaY = initialTouchY - touchMoveY;
        const touchDuration = Date.now() - initialTouchTime;
    
        // Adjust these thresholds as needed
        const zoomThreshold = 30;
        const timeThreshold = 150; // milliseconds
    
        if (Math.abs(deltaY) > zoomThreshold && touchDuration > timeThreshold) {
            // Likely a zoom gesture
            if (deltaY > 0) {
                // Swiping up, zoom in (previously zoom out)
                setZoomLevel(prevZoomLevel => Math.min(prevZoomLevel + 1, maxZoomLevel));
            } else {
                // Swiping down, zoom out (previously zoom in)
                setZoomLevel(prevZoomLevel => Math.max(prevZoomLevel - 1, 0));
            }
            event.preventDefault();
        }
    };
    

    const handleTouchEnd = () => {
        setInitialTouchY(null);
        setInitialTouchTime(null);
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


    useEffect(() => {
        if (selectedImage) {
            document.body.style.overscrollBehaviorY = 'none';
        } else {
            document.body.style.overscrollBehaviorY = 'auto';
        }
    }, [selectedImage]);

    

    if (selectedImage) {
        return (
            <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="swipe-handler"
        >
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
            </div>
        );
    }
    

    return (
        <div {...handlers} className="swipe-handler">
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