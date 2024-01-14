import React from 'react';

const GalleryGrid = ({ images, onImageClick }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
        {images.map((image, index) => (
            <img
                key={index}
                src={image}
                alt={`Image ${index + 1}`}
                className="w-full h-auto object-cover"
                onClick={() => onImageClick(image)}
            />
        ))}
    </div>
);

export default GalleryGrid;
