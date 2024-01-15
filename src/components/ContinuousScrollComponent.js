import React, { useEffect, useState } from 'react';

const ContinuousScrollComponent = ({ gallery, shuffledImages, setShuffledImages, openImage }) => {
    const [loadMore, setLoadMore] = useState({ top: false, bottom: false });

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
        const newImages = [...Array(16).keys()].map(k => `/${folderName}/${folderName}${k + 1}.png`);
        setShuffledImages(prevImages => [...prevImages, ...newImages]);
        setLoadMore({ top: false, bottom: false });
    }, [loadMore, gallery]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-0">
            {shuffledImages.map((image, index) => (
                <img
                    key={index}
                    src={image}
                    alt={`Image ${index + 1}`}
                    className="w-full h-auto object-cover"
                    onClick={() => openImage(image)} // Add the onClick handler here
                />
            ))}
        </div>
    );
};

export default ContinuousScrollComponent;