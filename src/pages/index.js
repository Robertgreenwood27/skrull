import React from 'react';
import Link from 'next/link';

const galleries = [
    { src: "/skull/skull0.png", alt: "Navigate to Skulls Gallery", href: "/skulls" },
    { src: "/neuron/neuron0.png", alt: "Navigate to Neurons Gallery", href: "/neurons" },
    // Add more galleries here as needed
];

const Index = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {galleries.map((gallery, index) => (
                <Link href={gallery.href} key={index} legacyBehavior>
                    <a className="block">
                        <img src={gallery.src} alt={gallery.alt} className="w-full h-auto object-cover" />
                    </a>
                </Link>
            ))}
        </div>
    );
};

export default Index;
