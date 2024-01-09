import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const GalleryPage = () => {
    const router = useRouter();
    const { gallery } = router.query;
    const [shuffledImages, setShuffledImages] = useState([]);
    const [loadMore, setLoadMore] = useState({ top: false, bottom: false });

    const shuffleArray = array => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    useEffect(() => {
        if (gallery) {
            const folderName = gallery.slice(0, -1);
            setShuffledImages(shuffleArray([...Array(16).keys()].map(k => `/${folderName}/${folderName}${k + 1}.png`)));
        }
    }, [gallery]);

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

    // Function to navigate back to the home page
    const navigateHome = () => {
        router.push('/'); // Using Next.js router to navigate
    };

    return (
        <>
            {/* Glowing navigation bar */}
            <div className="nav-bar" onClick={navigateHome}></div>

            {/* Gallery images */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
                {shuffledImages.map((image, index) => (
                    <img key={index} src={image} alt={`Image ${index + 1}`} className="w-full h-auto object-cover" />
                ))}
            </div>
        </>
    );
};

export default GalleryPage;