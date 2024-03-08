import React from 'react';
import Link from 'next/link';

const galleries = [
    { src: "/skull/skull0.png", alt: "Skulls", href: "/[gallery]", as: "/skulls" },
    { src: "/neuron/neuron0.png", alt: "Neurons", href: "/[gallery]", as: "/neurons" },
    { src: "/eye/eye0.png", alt: "Eyes", href: "/[gallery]", as: "/eyes" },
    { src: "/garbage/garbage0.png", alt: "Garbage", href: "/[gallery]", as: "/garbages" },
    { src: "/sadcat/sadcat0.png", alt: "Sadcats", href: "/[gallery]", as: "/sadcats" },
    // Add more galleries here as needed
];

const Index = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">Welcome to the Gallery</h1>
                <p className="text-xl">Click on an image to embark on a mesmerizing journey of discovery.</p>
                <p className="text-xl">Immerse yourself in the depths of each artwork and unravel its hidden secrets.</p>
            </div>
            <div className="flex flex-wrap justify-center">
                {galleries.map((gallery, index) => (
                    <Link href={gallery.href} as={gallery.as} key={index} legacyBehavior>
                        <a className="block relative group m-4">
                            <div className="relative overflow-hidden rounded-full w-64 h-64">
                                <img
                                    src={gallery.src}
                                    alt={gallery.alt}
                                    className="absolute inset-0 w-full h-full object-cover transition duration-500 ease-in-out transform group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 transition duration-500 ease-in-out group-hover:bg-opacity-30"></div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-500 ease-in-out group-hover:opacity-100">
                                    <span className="text-white text-xl font-bold">Explore</span>
                                </div>
                            </div>
                            <div className="mt-4 text-center">
                                <h2 className="text-lg font-semibold">{gallery.alt}</h2>
                            </div>
                        </a>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Index;