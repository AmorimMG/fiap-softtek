import React from 'react';
import Image from 'next/image'; // Assuming you are using Next.js

const Topbar = () => {
  return (
    <div className="topbar p-2">
      <Image src="/logo.webp" alt="Logo" width={200} height={200} />
    </div>
  );
};

export default Topbar;
