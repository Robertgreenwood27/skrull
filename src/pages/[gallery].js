import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ContinuousScrollComponent from '@/components/ContinuousScrollComponent';
import ZoomComponent from '@/components/ZoomComponent';

const GalleryPage = () => {
    const router = useRouter();
    const { gallery } = router.query;
    const [shuffledImages, setShuffledImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(0);
    const maxZoomLevel = 10;
    const [scrollPosition, setScrollPosition] = useState(0);

    // Function to shuffle the array of images
    const shuffleArray = array => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    // Function to check for .mp4 and fallback to .png
    const checkForVideo = (basePath) => {
        return fetch(`${basePath}.mp4`, { method: 'HEAD' })
            .then(res => res.ok ? `${basePath}.mp4` : `${basePath}.png`)
            .catch(() => `${basePath}.png`);
    };

    // Load and shuffle images when the gallery changes
    useEffect(() => {
        if (gallery) {
            const folderName = gallery.slice(0, -1);
            const imagePromises = [];
            for (let i = 1; i <= 16; i++) {
                const basePath = `/${folderName}/${folderName}${i}`;
                imagePromises.push(checkForVideo(basePath));
            }
            Promise.all(imagePromises).then(images => {
                setShuffledImages(shuffleArray(images));
            });
        }
    }, [gallery]);

    // Function to open an image in full screen
    const openImage = (image) => {
        setScrollPosition(window.scrollY); // Save the current scroll position
        const folderName = gallery.slice(0, -1);
        const baseImagePath = image.split('/').pop().split('.')[0];
        setSelectedImage(`/${folderName}/${baseImagePath}`);
        setZoomLevel(0); // Reset zoom level when a new image is opened
    };

    // Function to close the full screen view
    const closeFullScreen = () => {
        setSelectedImage(null);
    };

    // Function to handle base image swap
    const handleBaseImageSwap = (newBaseImage) => {
        setSelectedImage(newBaseImage);
    };

    // Restore the scroll position when selectedImage changes
    useEffect(() => {
        if (!selectedImage) {
            window.scrollTo(0, scrollPosition);
        }
    }, [selectedImage, scrollPosition]);

    if (selectedImage) {
        return (
            <div onClick={closeFullScreen}>
                <ZoomComponent 
                    selectedImage={selectedImage} 
                    maxZoomLevel={maxZoomLevel} 
                    setZoomLevel={setZoomLevel} 
                    zoomLevel={zoomLevel} 
                    onBaseImageSwap={handleBaseImageSwap} // Pass the callback function
                />
            </div>
        );
    }

    return (
        <ContinuousScrollComponent 
            gallery={gallery} 
            shuffledImages={shuffledImages} 
            setShuffledImages={setShuffledImages} 
            openImage={openImage} // Ensure this prop is passed
        />
    );
};

export default GalleryPage;