import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

interface HeroSectionProps {
  images?: string[];
  logo?: string;
  tagline?: string;
  locationInfo?: string;
  onBookClick?: () => void;
}

const HeroSection = ({
  images = [
    "https://images.unsplash.com/photo-1571983823232-07c35b70baae?w=1200&q=80",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80",
    "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1200&q=80",
  ],
  logo = "/vite.svg",
  tagline = "Eco-friendly farmstay in the lush hills of Karjat",
  locationInfo = "Near waterfalls and Bhimashankar Mandir",
  onBookClick = () => console.log("Book Your Stay clicked"),
}: HeroSectionProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full h-[800px] bg-gray-100 overflow-hidden">
      {/* Background Image Carousel */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${index === currentImageIndex ? "opacity-100" : "opacity-0"}`}
        >
          <img
            src={image}
            alt={`Nirvarra farmstay scene ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Overlay with dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60">
        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl"
          >
            {/* Logo */}
            <img
              src={logo}
              alt="Nirvarra Logo"
              className="w-32 h-32 mx-auto mb-6"
            />

            {/* Heading */}
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Nirvarra</h1>

            {/* Tagline */}
            <p className="text-xl md:text-2xl mb-3">{tagline}</p>

            {/* Location Info */}
            <p className="text-lg mb-8">{locationInfo}</p>

            {/* CTA Button */}
            <Button
              onClick={onBookClick}
              size="lg"
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 text-lg rounded-full transition-all transform hover:scale-105"
            >
              Book Your Stay
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Image Navigation Dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
