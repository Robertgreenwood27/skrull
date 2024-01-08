import React from 'react';
import Logo from './Logo';
import Link from 'next/link';

const MobileView = ({ isOpen, links }) => {
    return (
        <header className="header shadow-md">
            {/* Flex container to space out logo and menu icon */}
            <div className="flex items-center justify-between px-6 py-4">
                <Logo />
            </div>

            {/* Menu items */}
            {isOpen && (
                <div className="py-4">
                    {links.map((link, index) => (
                        <Link key={index} href={link.path} legacyBehavior>
                            <a className="menu-link block px-6 py-2 hover:bg-zinc-800 transition duration-300" style={{ color: 'rgb(var(--foreground-rgb))' }}>
                                {link.label}
                            </a>
                        </Link>
                    ))}
                </div>
            )}
        </header>
    );
}

export default MobileView;
