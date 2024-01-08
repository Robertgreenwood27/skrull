import React, { useState, useEffect } from 'react';

const Home = () => {
    const [shuffledImages, setShuffledImages] = useState([]);
    const [loadMore, setLoadMore] = useState({ top: false, bottom: false });

    useEffect(() => {
        setShuffledImages(shuffleArray([...Array(12).keys()].map(k => `${k + 1}.png`)));
        // Add event listener for scroll
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

        if (scrollTop + clientHeight === scrollHeight) {
            // Scrolled to bottom
            setLoadMore(prev => ({ ...prev, bottom: true }));
        } else if (scrollTop === 0) {
            // Scrolled to top
            setLoadMore(prev => ({ ...prev, top: true }));
        }
    };

    useEffect(() => {
        if (!loadMore.top && !loadMore.bottom) return;

        const newImages = shuffleArray([...Array(12).keys()].map(k => `${k + 1}.png`));

        if (loadMore.top) {
            setShuffledImages(prevImages => [...newImages, ...prevImages]);
        }

        if (loadMore.bottom) {
            setShuffledImages(prevImages => [...prevImages, ...newImages]);
        }

        setLoadMore({ top: false, bottom: false });
    }, [loadMore]);

    const shuffleArray = array => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
            {shuffledImages.map((image, index) => (
                <img key={index} src={`/${image}`} alt={`Image ${index}`} className="w-full h-auto" />
            ))}
        </div>
    );
};

export default Home;
