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
        const newImages = [...Array(16).keys()].map(k => {
            const basePath = `/${folderName}/${folderName}${k + 1}`;
            // Attempt to fetch the .mp4 version, if not available fallback to .png
            fetch(`${basePath}.mp4`, { method: 'HEAD' })
                .then(res => {
                    if (res.ok) {
                        return `${basePath}.mp4`;
                    } else {
                        return `${basePath}.png`;
                    }
                })
                .catch(() => `${basePath}.png`)
                .then(imagePath => setShuffledImages(prevImages => [...prevImages, imagePath]));
        });
        setLoadMore({ top: false, bottom: false });
    }, [loadMore, gallery]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-0">
            {shuffledImages.map((image, index) => (
                image.endsWith('.mp4') ? (
                    <video
                        key={index}
                        src={image}
                        alt={`Video ${index + 1}`}
                        className="w-full h-auto object-cover"
                        onClick={() => openImage(image)}
                        loop
                        autoPlay
                        muted
                    />
                ) : (
                    <img
                        key={index}
                        src={image}
                        alt={`Image ${index + 1}`}
                        className="w-full h-auto object-cover"
                        onClick={() => openImage(image)}
                    />
                )
            ))}
        </div>
    );
};

export default ContinuousScrollComponent;
