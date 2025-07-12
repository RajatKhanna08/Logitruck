import React from 'react'
import { Link } from 'react-router-dom'

const ServiceCard = ({ service, index }) => {
    return (
            <Link
                key={index}
                to={"/services"}
                className="z-10 bg-white p-5 rounded-2xl shadow-md hover:shadow-yellow-300 transition-shadow duration-300"
            >
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-50 mb-6 object-cover rounded-xl"
                />
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  {service.description}
                </p>
            </Link>
  )
}

export default ServiceCard
