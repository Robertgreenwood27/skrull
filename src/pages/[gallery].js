import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSwipeable } from 'react-swipeable';
import GalleryGrid from '../components/GalleryGrid';
import FullScreenImage from '../components/FullScreenImage';
import { debounce } from '../utils/debounce';

const GalleryPage = () => {
    const router = useRouter();
    const { gallery } = router.query;
    const [shuffledImages, setShuffledImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(0);
    const maxZoomLevel = 10;
    
    // Load and shuffle images when the gallery changes
    useEffect(() => {
        if (gallery) {
            const folderName = gallery.slice(0, -1);
            const images = [];
            for (let i = 1; i <= 16; i++) {
                images.push(`/${folderName}/${folderName}${i}.png`);
            }
            setShuffledImages(shuffleArray(images));
        }
    }, [gallery]);

    // Shuffle the array of images
    const shuffleArray = array => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    // Open an image in full screen
    const openImage = (image) => {
        setSelectedImage(image.split('/').pop().split('.')[0]);
        setZoomLevel(0); // Reset zoom level when a new image is opened
    };

    // Close the full screen view
    const closeFullScreen = () => {
        setSelectedImage(null);
    };

    // Handle zoom with mouse scroll
    const handleScrollZoom = (event) => {
        if (selectedImage) {
            const zoomingIn = event.deltaY < 0;
            debounce(() => {
                setZoomLevel(prevZoomLevel => {
                    if (zoomingIn) {
                        return Math.min(prevZoomLevel + 1, maxZoomLevel);
                    } else {
                        return Math.max(prevZoomLevel - 1, 0);
                    }
                });
            }, 250)();
            event.preventDefault();
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
        const folderName = gallery.slice(0, -1);
        const imagePath = `/${folderName}/${selectedImage}`;
        return (
            <FullScreenImage
                selectedImage={imagePath}
                zoomLevel={zoomLevel}
                maxZoomLevel={maxZoomLevel}
                onClose={closeFullScreen}
            />
        );
    }

    return (
        <div {...handlers} className="swipe-handler">
            <GalleryGrid images={shuffledImages} onImageClick={openImage} />
        </div>
    );
};

export default GalleryPage;
