import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Logo = () => {


  return (
    <Link href="/" passHref legacyBehavior>
      <a className="flex items-center space-x-4 no-underline">
        <div className="rounded-full overflow-hidden">
          <div>
            <Image src="/profile.png" alt="Profile Picture" width={200} height={200} />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">
            Robert Greenwood
          </h1>
        </div>
      </a>
    </Link>
  );
};

export default Logo;
