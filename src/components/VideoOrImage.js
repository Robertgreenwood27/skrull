import React from 'react';

const VideoOrImage = ({ videoSrc, imageSrc, alt, onClick }) => {
    return (
        <div onClick={onClick} className="media-container">
            {videoSrc ? (
                <video loop autoPlay muted className="w-full h-auto object-cover">
                    <source src={videoSrc} type="video/mp4" />
                    {/* Fallback to image if video can't be loaded */}
                    <img src={imageSrc} alt={alt} className="w-full h-auto object-cover" />
                </video>
            ) : (
                <img src={imageSrc} alt={alt} className="w-full h-auto object-cover" />
            )}
        </div>
    );
};

export default VideoOrImage;
