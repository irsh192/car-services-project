import React from 'react';

const Contact = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div className="contact-card" style={{ backgroundColor: 'gray', color: 'white', padding: '20px', margin: '20px', width: 'fit-content', maxWidth: '400px', borderRadius: '10px' }}>
        <h2 style={{ fontWeight: 'bold', textAlign: 'center', fontSize: '24px', padding: '10px 0' }}>Contact Details</h2>
        
        <div style={{ padding: '10px 0' }}>
          <h3 style={{ fontWeight: 'bold', fontSize: '18px' }}>Email:</h3>
          <p>shah.jee6446@gmail.com</p>
          <h3 style={{ fontWeight: 'bold', fontSize: '18px' }}>Phone:</h3>
          <p>+92 349-1504947</p>
        </div>
        <div style={{ padding: '10px 0' }}>
          <h3 style={{ fontWeight: 'bold', fontSize: '18px' }}>Contact details:</h3>
          <p>ProMotors, based on Dalazak Road in Peshawar, Pakistan, is your trusted source for car services and parts. With a commitment to quality and customer satisfaction, ProMotors provides top-notch car care and a wide range of premium car parts to keep your vehicle running smoothly and efficiently.</p>

        </div>
      </div>
    </div>
  );
};

export default Contact;
