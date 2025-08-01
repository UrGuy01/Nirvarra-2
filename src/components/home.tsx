import React, { useState } from "react";
import HeroSection from "./HeroSection";
import ExperienceCarousel from "./ExperienceCarousel";
import AccommodationSection from "./AccommodationSection";
import PetFriendlySection from "./PetFriendlySection";
import BookingForm from "./BookingForm";
import { Button } from "./ui/button";
import { MapPin, Phone, Mail } from "lucide-react";
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from "@clerk/clerk-react";

const HomePage = () => {
  const [showBookingForm, setShowBookingForm] = useState(false);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-stone-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-xl font-semibold text-white">Nirvarra</div>
          <div className="hidden md:flex space-x-6">
            <a
              href="#home"
              className="text-white hover:text-amber-300 transition-colors"
            >
              Home
            </a>
            <a
              href="#experiences"
              className="text-white hover:text-amber-300 transition-colors"
            >
              Experiences
            </a>
            <a
              href="#stay"
              className="text-white hover:text-amber-300 transition-colors"
            >
              Stay Options
            </a>
            <a
              href="#contact"
              className="text-white hover:text-amber-300 transition-colors"
            >
              Contact
            </a>
          </div>
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-stone-900">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="bg-amber-500 hover:bg-amber-600 text-white border-none">
                  Sign Up
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
              <Button
                variant="outline"
                className="bg-amber-500 hover:bg-amber-600 text-white border-none"
                onClick={() => setShowBookingForm(true)}
              >
                Book Now
              </Button>
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-16">
        <HeroSection />
      </section>

      {/* Experiences Section */}
      <section id="experiences" className="py-20 bg-stone-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-4 text-stone-800">
            Unforgettable Experiences
          </h2>
          <p className="text-center text-stone-600 mb-12 max-w-2xl mx-auto">
            Immerse yourself in nature and create lasting memories with our
            curated experiences at Nirvarra Farmstay.
          </p>
          <ExperienceCarousel />
        </div>
      </section>

      {/* Accommodation Section */}
      <section id="stay" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-4 text-stone-800">
            Stay Options
          </h2>
          <p className="text-center text-stone-600 mb-12 max-w-2xl mx-auto">
            Choose from our comfortable and eco-friendly accommodation options,
            each designed to connect you with nature.
          </p>
          <AccommodationSection />
        </div>
      </section>

      {/* Pet Friendly Section */}
      <section className="py-20 bg-stone-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-4 text-stone-800">
            Pet-Friendly Paradise
          </h2>
          <p className="text-center text-stone-600 mb-12 max-w-2xl mx-auto">
            At Nirvarra, we welcome your furry friends to enjoy the farmstay
            experience alongside you.
          </p>
          <PetFriendlySection />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-stone-800 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-4">
            Contact Us
          </h2>
          <p className="text-center text-stone-300 mb-12 max-w-2xl mx-auto">
            Have questions or ready to book your stay? Reach out to us and we'll
            be happy to assist you.
          </p>

          <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-10">
            <div className="flex flex-col items-center md:items-start space-y-6 max-w-md">
              <div className="flex items-center gap-3">
                <MapPin className="text-amber-400" />
                <div>
                  <h3 className="font-medium">Location</h3>
                  <p className="text-stone-300">
                    Nirvarra Farmstay, Karjat, Maharashtra
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="text-amber-400" />
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p className="text-stone-300">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="text-amber-400" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-stone-300">info@nirvarrafarmstay.com</p>
                </div>
              </div>
            </div>

            <div className="w-full max-w-md bg-stone-700 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-4">Send us a message</h3>
              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-3 py-2 bg-stone-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 bg-stone-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-3 py-2 bg-stone-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
                  ></textarea>
                </div>
                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Book Your Stay</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBookingForm(false)}
                >
                  ✕
                </Button>
              </div>
              <BookingForm />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-stone-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-semibold">Nirvarra</h2>
              <p className="text-stone-400">Eco-friendly farmstay in Karjat</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <a
                href="#home"
                className="text-stone-300 hover:text-amber-400 transition-colors"
              >
                Home
              </a>
              <a
                href="#experiences"
                className="text-stone-300 hover:text-amber-400 transition-colors"
              >
                Experiences
              </a>
              <a
                href="#stay"
                className="text-stone-300 hover:text-amber-400 transition-colors"
              >
                Stay Options
              </a>
              <a
                href="#contact"
                className="text-stone-300 hover:text-amber-400 transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
          <div className="border-t border-stone-700 mt-6 pt-6 text-center text-stone-400">
            <p>
              © {new Date().getFullYear()} Nirvarra Farmstay. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
