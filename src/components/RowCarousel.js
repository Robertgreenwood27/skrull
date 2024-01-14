import react, {useState} from 'react';

export const RowCarousel = ({ images, openImage }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleMoveLeft = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleMoveRight = () => {
        if (currentIndex < images.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    return (
        <div className="carousel-row" onMouseEnter={handleMoveRight} onMouseLeave={handleMoveLeft}>
            {images.map((image, index) => (
                <img
                    key={index}
                    src={image}
                    alt={`Image ${index}`}
                    className={index === currentIndex ? "visible" : "hidden"}
                    onClick={() => openImage(image)}
                />
            ))}
        </div>
    );
};
