import React from 'react';

const Footer = () => {
  return (
    <div className="bg-black text-white py-8 mt-5">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        {/* First Column */}
        <div className="footer_agile_inner_info_w3l">
          <div className="col-md-3 footer-left">
          <h2 className="text-white text-xl font-light tracking-wide"><a href="/" className="text-white"><span className="px-2 text-6x1 bg-teal-500 font-semibold mr-1">Pro</span>Motors</a></h2>
            <p className="text-gray-400 hover:text-white text-center leading-relaxed font-serif text-sm mt-4 ml-10">AutoCare Hub: Reliable Car Services and Parts</p>
          </div>
        </div>
        {/* Second Column */}
        <div className="flex flex-col items-center">
        <h2 className="text-xl mb-4"><span className="font-bold">OUR</span> INFORMATION</h2>

  <ul className="text-sm leading-loose text-justify">
    <li><a href="/" className="text-gray-400 hover:text-white">Home</a></li>
    {/* <li><a href="/mens-wear" className="text-gray-400 hover:text-white">Men's Wear</a></li>
    <li><a href="/womens-wear" className="text-gray-400 hover:text-white">Women's Wear</a></li> */}
    <li><a href="/about" className="text-gray-400 hover:text-white">About</a></li>
    <li><a href="/contact" className="text-gray-400 hover:text-white">Contact</a></li>
  </ul>
</div>


        {/* Third Column */}
        <div className="flex flex-col items-center">
  <div className="text-center">
  <h2 className="text-xl mb-4"><span className="font-bold">PROMOTORS</span> INFORMATION</h2>

  </div>
  
  <div className="flex flex-col items-center">
    <div className="mb-4 flex items-center">
      <div>
        <h3 className="font-semibold text-gray-400">Phone Number</h3>
        <p className="text-gray-400 text-center">+92 349-1504947</p>
      </div>
    </div>
    
    <div className="mb-4 flex items-center">
      <div>
        <h3 className="font-semibold text-gray-400 text-center">Email Address</h3>
        <p className="text-gray-400 text-center">shah.jee6446@gmail.com</p>
      </div>
    </div>
    
    <div className="flex items-center">
      <div>
        <h3 className="font-semibold text-gray-400 text-center">Location</h3>
        <p className="text-gray-400 text-center">Dalazak Road Chock Peshawar.</p>
      </div>
    </div>
  </div>
</div>

      </div>
    </div>
  );
};

export default Footer;
