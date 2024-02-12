'use client';

import Image from 'next/image';
import img from '/public/images/logo.svg';

export const PageHeader = () => {
  return (
    <div>
      <div className="my-3.5 flex items-center justify-center">
        <Image alt="logo" height={40} src={img} width={56} />
      </div>
      <hr className="border-b border-tints-battleship-grey-tint-5 my-4" />
    </div>
  );
};
