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
    const [isLoading, setIsLoading] = useState(true);
    const [isNavigationVisible, setIsNavigationVisible] = useState(false);

    // ... Touch and click event handlers ...

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
            setIsLoading(true);
            const folderName = gallery.slice(0, -1);
            const imagePromises = [];
            for (let i = 1; i <= 16; i++) {
                const basePath = `/${folderName}/${folderName}${i}`;
                imagePromises.push(checkForVideo(basePath));
            }
            Promise.all(imagePromises)
                .then(images => {
                    setShuffledImages(shuffleArray(images));
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error('Error loading images:', error);
                    setIsLoading(false);
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
        setIsNavigationVisible(true); // Show navigation when an image is opened
    };

    // Function to close the full screen view
    const closeFullScreen = () => {
        setSelectedImage(null);
        setIsNavigationVisible(false); // Hide navigation when closing full screen view
    };

    // Function to handle base image swap
    const handleBaseImageSwap = (newBaseImage) => {
        setSelectedImage(newBaseImage);
    };

    // Function to navigate to the previous image
    const navigateToPreviousImage = () => {
        const currentIndex = shuffledImages.findIndex(image => image.includes(selectedImage.split('/').pop().split('.')[0]));
        const previousIndex = (currentIndex - 1 + shuffledImages.length) % shuffledImages.length;
        openImage(shuffledImages[previousIndex]);
    };

    // Function to navigate to the next image
    const navigateToNextImage = () => {
        const currentIndex = shuffledImages.findIndex(image => image.includes(selectedImage.split('/').pop().split('.')[0]));
        const nextIndex = (currentIndex + 1) % shuffledImages.length;
        openImage(shuffledImages[nextIndex]);
    };

    // ... Show/hide navigation on mouse move ...

    // ... Keyboard event handler ...

    // ... Add event listeners ...

    // Restore the scroll position when selectedImage changes
    useEffect(() => {
        if (!selectedImage) {
            window.scrollTo(0, scrollPosition);
        }
    }, [selectedImage, scrollPosition]);

    if (selectedImage) {
        return (
            <div onClick={closeFullScreen} role="dialog" aria-modal="true">
                <ZoomComponent
                    selectedImage={selectedImage}
                    maxZoomLevel={maxZoomLevel}
                    setZoomLevel={setZoomLevel}
                    zoomLevel={zoomLevel}
                    onBaseImageSwap={handleBaseImageSwap}
                    onPreviousImage={navigateToPreviousImage}
                    onNextImage={navigateToNextImage}
                />
                {isNavigationVisible && (
                    <div className="absolute inset-0 flex justify-between items-center">
                        <button
                            className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-full"
                            onClick={navigateToPreviousImage}
                        >
                            &larr;
                        </button>
                        <button
                            className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-full"
                            onClick={navigateToNextImage}
                        >
                            &rarr;
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <>
            {isLoading ? (
                <div className="loading-spinner">Loading...</div>
            ) : (
                <ContinuousScrollComponent
                    gallery={gallery}
                    shuffledImages={shuffledImages}
                    setShuffledImages={setShuffledImages}
                    openImage={openImage}
                />
            )}
        </>
    );
};

export default GalleryPage;