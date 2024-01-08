import React from 'react';
import Logo from './Logo';
import Link from 'next/link';

const DeskView = ({ links }) => {
    return (
        <header className="header flex items-center justify-between px-6 py-4 shadow-md">
            <Logo />

            <nav className="flex items-center space-x-4">
                {links.map((link, index) => (
                    <Link key={index} href={link.path} legacyBehavior>
                        <a className="nav-link" data-text={link.label}>
                            {link.label}
                        </a>
                    </Link>
                ))}
            </nav>
        </header>
    );
}

export default DeskView;
