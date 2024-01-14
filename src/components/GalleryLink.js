import React from 'react';
import Link from 'next/link';

const GalleryLink = ({ src, alt, href, as }) => (
    <Link href={href} as={as} legacyBehavior>
        <a className="block">
            <img src={src} alt={alt} className="w-full h-auto object-cover" />
        </a>
    </Link>
);

export default GalleryLink;
