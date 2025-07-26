import { useEffect, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { FaPhoneAlt } from 'react-icons/fa';
import { HiMail } from 'react-icons/hi';
import Footer from '../components/Footer';

const ContactUsPage = () => {
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    from_name: '',
    user_email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    emailjs.init(import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Method 1: Using emailjs.send (current approach)
      const result = await emailjs.send(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        formData,
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      );

      console.log('SUCCESS!', result.status, result.text);
      alert('Message sent successfully!');
      setFormData({ from_name: '', user_email: '', phone: '', subject: '', message: '' });

    } catch (error) {
      // Better error logging
      console.error('Full EmailJS Error:', error);
      console.error('Error status:', error?.status);
      console.error('Error text:', error?.text);
      console.error('Error message:', error?.message);
      alert('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full">
      {/* BACKGROUND IMAGE */}
      <div
        className="relative flex justify-center items-center w-full h-100 bg-cover bg-bottom bg-no-repeat"
        style={{ backgroundImage: "url('/contactBackground.jpeg')" }}
      >
        <p className="text-6xl mt-20 text-yellow-300 font-bold text-shadow-black text-shadow-md tracking-wider">
          CONTACT US
        </p>
      </div>

      {/* MAIN CONTENT */}
      <div className="mb-40 flex flex-col lg:flex-row gap-20 p-10">
        {/* LEFT SECTION */}
        <div className="p-10 flex flex-col gap-15 flex-1">
          <div className="flex flex-col gap-5">
            <p className="text-5xl font-semibold">Get In Touch</p>
            <p className="text-yellow-300 font-medium text-2xl max-w-150">
              "LG Transports specializes in smart, reliable, and budget-friendly logistics solutions,
              connecting verified trucks and drivers across India for fast and secure deliveries."
            </p>
          </div>

          <div className="relative mt-10 flex flex-col gap-8">
            <img
              src="/contactFooterImage.avif"
              className="absolute -top-17 right-10 z-1 w-130 opacity-35 rounded-lg"
              alt="contact"
            />

            <div className="flex justify-start items-center gap-6 z-2">
              <div className="bg-yellow-300 p-5 rounded-xl">
                <FaPhoneAlt size={40} />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-2xl font-medium">Have any Questions?</p>
                <p className="text-xl text-center font-medium">+91 1234567890</p>
              </div>
            </div>
            <div className="flex justify-start items-center gap-6 z-2">
              <div className="bg-yellow-300 p-5 rounded-xl">
                <HiMail size={40} />
              </div>
              <div className="flex flex-col w-56 justify-center">
                <p className="text-2xl text-center font-medium">Write To Us</p>
                <p className="text-xl text-center font-medium">logitruck@gmail.com</p>
              </div>
          </div>
        </div>
        </div>

        {/* RIGHT SECTION */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="p-10 flex flex-col gap-10 bg-gray-50 rounded-lg shadow-lg flex-1"
        >
          <p className="text-4xl text-[#192a67] font-semibold">Contact for Queries?</p>

          <div className="flex flex-col gap-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="from_name"
                value={formData.from_name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className="p-3 border-gray-300 border-2 rounded-md outline-none focus:ring-2 focus:ring-yellow-300"
              />
              <input
                type="email"
                name="user_email"
                value={formData.user_email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                className="p-3 border-gray-300 border-2 rounded-md outline-none focus:ring-2 focus:ring-yellow-300"
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="p-3 border-gray-300 border-2 rounded-md outline-none focus:ring-2 focus:ring-yellow-300"
              />
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                className="p-3 border-gray-300 border-2 rounded-md outline-none focus:ring-2 focus:ring-yellow-300"
              />
            </div>

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Message"
              rows={6}
              required
              className="border-gray-300 outline-none focus:ring-2 focus:ring-yellow-300 rounded-lg p-3 border-2"
            ></textarea>

            <button
              type="submit"
              disabled={loading}
              className="text-yellow-200 bg-[#192a67] hover:bg-[#3e4661] cursor-pointer p-3 text-xl font-semibent rounded-lg"
            >
              {loading ? 'Sending...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default ContactUsPage;