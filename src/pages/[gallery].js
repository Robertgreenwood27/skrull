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
    const maxZoomLevel = 10;
    const [initialTouchY, setInitialTouchY] = useState(null);
    const [initialTouchTime, setInitialTouchTime] = useState(null);

    const debounce = (func, delay) => {
        let debounceTimer;
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(context, args), delay);
        };
    };

    const handleTouchStart = (event) => {
        setInitialTouchY(event.touches[0].clientY);
        setInitialTouchTime(Date.now());
    };

    const handleTouchMove = (event) => {
        event.preventDefault();
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
        const baseImagePath = image.includes('/') ? image.split('/')[2].split('.')[0] : image.split('.')[0];
        setSelectedImage(`/skull/${baseImagePath}`);
        setZoomLevel(0); // Reset zoom level when a new image is opened
    
        // Preload all zoom layers
        [...Array(maxZoomLevel).keys()].forEach(index => {
            const zoomLayer = new Image();
            zoomLayer.src = `/skull/${baseImagePath}${String.fromCharCode(97 + index)}.png`; // e.g., skull4a.png
        });
    };
    

    // Function to close the full screen view
    const closeFullScreen = () => {
        setSelectedImage(null);
    };

    const handleScrollZoom = debounce((event) => {
        if (selectedImage) {
            const zoomingIn = event.deltaY < 0;

            setZoomLevel(prevZoomLevel => {
                if (zoomingIn) {
                    // Scroll up, zoom in by one level
                    return Math.min(prevZoomLevel + 1, maxZoomLevel);
                } else {
                    // Scroll down, zoom out by one level
                    return Math.max(prevZoomLevel - 1, 0);
                }
            });

            event.preventDefault();
        }
    }, 1000); // Adjust the delay as needed, 250 milliseconds is a starting point



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
        document.body.style.overscrollBehaviorY = 'contain';
        return () => {
            document.body.style.overscrollBehaviorY = 'auto';
        };
    }, []);



    if (selectedImage) {
        return (
            <div
                onTouchStart={(event) => {
                    handleTouchStart(event);
                    event.preventDefault(); // Prevent default to disable pull-to-refresh
                }}
                onTouchMove={(event) => {
                    handleTouchMove(event);
                    event.preventDefault(); // Prevent default to disable pull-to-refresh
                }}
                onTouchEnd={handleTouchEnd}
                className="swipe-handler"
                style={{ touchAction: 'none' }} // Disable browser's default touch actions
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
                        const isActive = zoomLevel > index;
                        return (
                            <img
                                key={index}
                                src={`${selectedImage}${String.fromCharCode(97 + index)}.png`} // e.g., skull4a.png, skull4b.png, etc.
                                alt={`Zoom level ${index + 1}`}
                                className={`zoom-layer ${isActive ? 'active' : ''}`}
                                style={{
                                    transform: `translate(-50%, -50%) scale(${Math.pow(2, index + 1 - zoomLevel)})`,
                                    touchAction: 'none' // Disable browser's default touch actions on each zoom layer
                                }}
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