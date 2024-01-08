import React from 'react';

const HamburgerIcon = ({ toggleOpen }) => {
    return (
        <button onClick={toggleOpen} className="menu-button p-2 rounded-md focus:outline-none absolute top-0 right-0 m-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
        </button>
    );
}

export default HamburgerIcon;
