import React, { useEffect, useState } from 'react';

const ContinuousScrollComponent = ({ gallery, shuffledImages, setShuffledImages, openImage }) => {
    const [loadMore, setLoadMore] = useState({ top: false, bottom: false });
    const [isLoading, setIsLoading] = useState(false);

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
        if (!loadMore.bottom || !gallery) return;

        setIsLoading(true);

        const folderName = gallery.slice(0, -1);
        const newImages = [...Array(16).keys()].map(k => {
            const basePath = `/${folderName}/${folderName}${k + 1}`;
            // Attempt to fetch the .mp4 version, if not available fallback to .png
            return fetch(`${basePath}.mp4`, { method: 'HEAD' })
                .then(res => {
                    if (res.ok) {
                        return `${basePath}.mp4`;
                    } else {
                        return `${basePath}.png`;
                    }
                })
                .catch(() => `${basePath}.png`);
        });

        Promise.all(newImages)
            .then(imagePaths => {
                setShuffledImages(prevImages => [...prevImages, ...imagePaths]);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching images:', error);
                setIsLoading(false);
            });

        setLoadMore({ top: false, bottom: false });
    }, [loadMore, gallery, setShuffledImages]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {shuffledImages.map((image, index) => (
                <div key={index} className="aspect-w-1 aspect-h-1">
                    {image.endsWith('.mp4') ? (
                        <video
                            src={image}
                            alt={`Video ${index + 1}`}
                            className="object-cover w-full h-full"
                            onClick={() => openImage(image)}
                            loop
                            autoPlay
                            muted
                            playsInline
                        />
                    ) : (
                        <img
                            src={image}
                            alt={`Image ${index + 1}`}
                            className="object-cover w-full h-full"
                            onClick={() => openImage(image)}
                            loading="lazy"
                        />
                    )}
                </div>
            ))}
            {isLoading && (
                <div className="col-span-full text-center">
                    <p>Loading more images...</p>
                </div>
            )}
        </div>
    );
};

export default ContinuousScrollComponent;