import React from 'react';
import { FaGlobe, FaTruckMoving, FaMapMarkerAlt, FaBoxOpen, FaClock } from 'react-icons/fa';
import Footer from '../components/Footer';

const AboutUsPage = () => {
  return (
    <div>
      <header
        className="relative bg-cover bg-center text-white py-20 px-4"
        style={{
          backgroundImage: 'url("/aboutusimg1.jpg")',
          minHeight: '300px',
        }}>
        <div className="bg-opacity-60 p-6 max-w-6xl mx-auto mt-15">
          <h1 className="text-5xl font-bold text-center text-yellow-400 mb-4 mt-10">
            ABOUT US
          </h1>
          <p className="text-lg text-center max-w-8xl mx-auto leading-relaxed">
            Logitruck is India's leading logistics platform, connecting businesses with trusted transporters and drivers. Our mission is to simplify freight movement across the country through technology, transparency, and reliability.
          </p>
        </div>
      </header>

      {/* Achievement */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-blue-900 mb-12">OUR ACHIEVEMENT</h2>
        
        <div className="flex flex-col md:flex-row items-center gap-12">
          
          {/* Left Side - Text Content */}
          <div className="md:w-1/2 text-lg leading-relaxed text-gray-800 space-y-4">
            <p>
              At <span className="font-semibold text-blue-800">Logitruck</span>, we’re transforming the logistics space by digitizing the traditional freight booking process.
              Our goal is to provide a reliable and transparent platform for companies, transporters, and drivers.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Built a digital alternative to manual and phone-based freight bookings.</li>
              <li>Enabled quick vehicle selection for different load types and destinations.</li>
              <li>Integrated live tracking for real-time shipment updates.</li>
              <li>Facilitated smooth communication between companies, transporters, and drivers.</li>
              <li>Improved pricing transparency and reduced hidden costs in logistics transactions.</li>
              <li>Focused on user-friendly design to simplify operations for all users.</li>
            </ul>
          </div>

          {/* Right Side - Image with Hover Background */}
          <div className="md:w-1/2 transition duration-300 rounded-xl">
            <div className="p-2 bg-gray-100 hover:bg-white rounded-xl transition duration-300 shadow-lg">
              <img
                src="https://financialexpresswpcontent.s3.amazonaws.com/uploads/2020/06/Tata-trucks-buses1-660.jpg"
                alt="Truck Achievement"
                className="rounded-xl w-full object-cover transition duration-300"
              />
            </div>
          </div>

        </div>
      </section>

      {/* How it Works */}0
      <section
        className="relative bg-cover bg-center text-white"
        style={{
          backgroundImage: 'url("/aboutusimg2.jpg")',
          minHeight: '320px',
        }}
      >
        <div className="relative z-10 flex flex-col md:flex-row text-center text-white h-full">

          {/* Column 1: Title & Tagline */}
          <div className="flex flex-col justify-center items-center p-10 md:w-2/5">
            <h2 className="text-4x1 md:text-3xl font-bold text-yellow-400 mb-10 mt-12 align: center">HOW IT WORKS</h2>
            <p className="text-m mt-14">We Provide Highest Quality</p>
          </div>

          {/* Step 1 */}
          <div className="flex flex-col justify-center items-center p-6 md:w-1/4">
            <div className="bg-yellow-400 text-black font-bold rounded-full w-10 h-10 flex items-center justify-center text-lg mb-2">1</div>
            <p className="text-yellow-400 font-bold leading-tight text-sm md:text-base">
              CHOOSE<br />YOUR<br />VEHICLE
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col justify-center items-center p-6 md:w-1/4">
            <div className="bg-yellow-400 text-black font-bold rounded-full w-10 h-10 flex items-center justify-center text-lg mb-2">2</div>
            <p className="text-yellow-400 font-bold leading-tight text-sm md:text-base">
              SELECT<br />PAYMENT
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col justify-center items-center p-6 md:w-1/4">
            <div className="bg-yellow-400 text-black font-bold rounded-full w-10 h-10 flex items-center justify-center text-lg mb-2">3</div>
            <p className="text-yellow-400 font-bold leading-tight text-sm md:text-base">
              TRACK<br />YOUR<br />ORDER
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="w-full min-h-screen bg-white px-6 py-20 flex items-center justify-center">
        <div className="max-w-7xl w-full mx-auto rounded-xl shadow-md bg-white p-10">
          <h2 className="text-4xl font-bold text-blue-900 mb-12 text-center">OUR MISSION</h2>

          <div className="flex flex-col md:flex-row items-center gap-12">
            
            {/* Left Text */}
            <div className="md:w-1/2 text-lg leading-relaxed space-y-5 text-gray-800">
              <p>
                <span className="text-yellow-600 font-semibold">To revolutionize logistics</span> in India through smart technology and seamless connectivity.
                At Logitruck, we’re building more than just a platform — we’re driving a logistics transformation.
              </p>

              <ul className="list-disc pl-5 space-y-3">
                <li>
                  <span className="font-semibold text-blue-800">Reduce Communication Gaps:</span> Real-time coordination between businesses, transporters, and drivers — no more endless calls.
                </li>
                <li>
                  <span className="font-semibold text-blue-800">Smart Decision-Making:</span> Route history, live tracking, and booking data empower informed decisions.
                </li>
                <li>
                  <span className="font-semibold text-blue-800">Transparent & Fair Pricing:</span> No hidden surprises — all based on distance and logic.
                </li>
                <li>
                  <span className="font-semibold text-blue-800">Reliable Deliveries:</span> Verified drivers and consistent updates for worry-free shipping.
                </li>
                <li>
                  <span className="font-semibold text-blue-800">Simple & Accessible:</span> Designed for ease of use — for both logistics pros and first-timers.
                </li>
              </ul>

              <p>
                We’re also proud to support India’s digital journey — delivering efficiency from cities to villages.
                Every trip taken through Logitruck brings the country closer to a smarter, more connected future.
              </p>
            </div>

            {/* Right Image */}
            <div className="md:w-1/2">
              <div className="rounded-xl overflow-hidden shadow-lg transition duration-300 hover:shadow-2xl hover:scale-105 bg-white p-2">
                <img
                  src="https://thumbs.dreamstime.com/b/innovative-eco-truck-travels-mountain-road-wind-farms-distance-symbolizing-profitable-economical-359330720.jpg"
                  alt="Eco Truck"
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Highlights */}
      <section
        className="bg-cover bg-center text-white text-center py-20"
        style={{ backgroundImage: 'url("/aboutusimg3.jpg")' }}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center md:justify-between gap-y-10">
          {[
            { icon: <FaGlobe className="text-white" size={60} />, label: 'NATIONWIDE\nREACH' },
            { icon: <FaTruckMoving className="text-white" size={60} />, label: 'VERIFIED TRUCKS\n& DRIVERS' },
            { icon: <FaMapMarkerAlt className="text-white" size={60} />, label: 'LIVE TRACKING\nUPDATES' },
            {
              icon: (
                <div className="flex items-center justify-center gap-2">
                  <FaBoxOpen className="text-white" size={48} />
                  <FaClock className="text-white" size={28} />
                </div>
              ),
              label: 'SAFE & ON-TIME\nDELIVERY',
            },
          ].map(({ icon, label }, idx) => (
            <div
              key={idx}
              className="w-full md:w-1/4 flex flex-col items-center px-4"
            >
              <div className="mb-4">{icon}</div>
              <p className="text-lg font-semibold whitespace-pre-line leading-snug">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Driving India Forward */}
      <section className="w-full bg-blue-50 py-20 px-6 flex items-center justify-center">
        <div className="max-w-6xl w-full mx-auto">
          <h2 className="text-4xl font-bold text-blue-900 text-center mb-12">
            DRIVING INDIA FORWARD TOGETHER
          </h2>

          <div className="flex flex-col md:flex-row items-center gap-12">
            
            {/* Left Text */}
            <div className="md:w-1/2 text-lg leading-relaxed space-y-5 text-gray-800">
              <p>
                At <span className="font-semibold text-yellow-600">Logitruck</span>, we believe logistics is the backbone of a thriving economy. From bustling cities to the remotest villages, our platform bridges the gap between demand and delivery.
              </p>
              <p>
                We’re committed to making transportation faster, fairer, and more accessible for businesses of all sizes — whether you're shipping industrial loads or moving essential supplies.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><span className="font-semibold text-blue-800">Pan-India Coverage:</span> We serve across state borders, rural belts, and industrial hubs.</li>
                <li><span className="font-semibold text-blue-800">Empowering Local Drivers:</span> We bring job opportunities to truck owners and drivers across the country.</li>
                <li><span className="font-semibold text-blue-800">Boosting MSMEs:</span> By simplifying logistics, we help small and medium enterprises grow.</li>
              </ul>
              <p>
                Every trip powered by Logitruck moves India a little closer to a more connected, efficient, and resilient logistics ecosystem.
              </p>
            </div>

            {/* Right Image */}
            <div className="md:w-1/2">
              <div className="rounded-xl overflow-hidden shadow-lg bg-white p-2 hover:scale-105 transition-transform duration-300">
                <img
                  src="https://img.freepik.com/premium-vector/online-delivery-service-concept_165488-1361.jpg"
                  alt="Driving India"
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
       {/* FOOTER */}
      <div>
        <Footer />
      </div>

    </div>
  );
};

export default AboutUsPage;
