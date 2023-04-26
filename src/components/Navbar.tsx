import Link from 'next/link';
import React from 'react';

const Navbar = () => {
  return (
    <nav className='container mx-auto px-5 lg:w-2/5 lg:px-2 '>
      <div className='container flex items-center justify-between'>
        <Link
          href='/'
          className='mx-auto flex items-center justify-between text-2xl font-medium'
        >
          kcode
        </Link>
        <div>
          <ul className='flex items-center py-4 text-sm'>
            <li>
              <Link
                href='/'
                className='blook px-4 py-2 transition-all duration-300 hover:text-sky-900'
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href='https://twitter.com/home?lang=ja'
                className='blook px-4 py-2 transition-all duration-300 hover:text-sky-900'
              >
                Twitter
              </Link>
            </li>
            <li>
              <Link
                href='https://qiita.com/'
                className='blook px-4 py-2 transition-all duration-300 hover:text-sky-900'
              >
                Qiita
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
