//index.js
import React from 'react';
import Link from 'next/link';

const galleries = [
    { src: "/skull/skull0.png", alt: "Navigate to Skulls Gallery", href: "/[gallery]", as: "/skulls" },
    { src: "/neuron/neuron0.png", alt: "Navigate to Neurons Gallery", href: "/[gallery]", as: "/neurons" },
    { src: "/eye/eye0.png", alt: "Navigate to Eyes Gallery", href: "/[gallery]", as: "/eyes" },
    { src: "/garbage/garbage0.png", alt: "Navigate to Garbages Gallery", href: "/[gallery]", as: "/garbages" },
    { src: "/sadcat/sadcat0.png", alt: "Navigate to sadcats Gallery", href: "/[gallery]", as: "/sadcats" },
    // Add more galleries here as needed
];

const Index = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {galleries.map((gallery, index) => (
                <Link href={gallery.href} as={gallery.as} key={index} legacyBehavior>
                    <a className="block">
                        <img src={gallery.src} alt={gallery.alt} className="w-full h-auto object-cover" />
                    </a>
                </Link>
            ))}
        </div>
    );
};

export default Index;