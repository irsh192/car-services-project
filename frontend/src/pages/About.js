import React from 'react';
import car4 from '../assets/images/car4.jpg';

const About = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', margin: '20px' }}>
      <img src={car4} alt="Bottom 1" className="about-image" style={{ width: '50%', objectFit: 'cover', marginRight: '20px' }} />
      <div className="about-content" style={{ backgroundColor: 'gray', color: 'white', padding: '20px', width: '50%', textAlign: 'justify' }}>
      <h1 style={{ fontWeight: 'bold', fontSize: '24px', textAlign: 'center' }}>About</h1>
          <p style={{ fontWeight: 'bold', fontSize: '24px', textAlign: 'center', color: '#000000' }}>
            ProMotors: Your Trusted Source for Car Services and Parts
          </p>
          <p>
            ProMotors is your premier destination for top-quality car services and parts. Specializing in comprehensive car care, ProMotors ensures your vehicle runs smoothly and efficiently. Whether you need routine maintenance, repairs, or premium car parts, ProMotors has you covered.
          </p>
          <p>
            At ProMotors, we pride ourselves on offering an extensive selection of car parts, including LED lights, key covers, steering covers, and more. Our team of skilled technicians is dedicated to providing exceptional service, ensuring your car receives the best care possible.
          </p>
          <p>
            With a commitment to excellence, ProMotors offers a seamless experience, from easy online browsing of our extensive parts catalog to fast and reliable service appointments. We prioritize customer satisfaction, offering swift shipping and hassle-free returns, so you can shop with confidence.
          </p>
          <p>
            Stay ahead on the road with ProMotors, where quality meets convenience. Trust us to keep your vehicle in peak condition, making ProMotors your go-to hub for all car service and part needs.
          </p>
      </div>
    </div>
  );
};

export default About;
