import React, { useState, useRef } from 'react';
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi';
import { BsPlayFill, BsPauseFill } from 'react-icons/bs';

const customerData = [
  {
    id: 'techstart',
    logo: 'https://cdn.prod.website-files.com/66e88746834b80507cdf7933/66ec7ff7808fef2aeecfff1b_Outliant.svg',
    video: 'https://dhygzobemt712.cloudfront.net/Web/home/2024-wxp/customers/lattice.mp4',
    poster: 'https://cdn.prod.website-files.com/66e88746834b80507cdf7933/66ec7faa88e83cdb12efc5b3_lattice-bg.webp',
    stat: '94%',
    statDesc: 'job placement rate',
    quote: "CodeTutor's platform revolutionized how we train our junior developers. The AI-powered guidance and interactive exercises have significantly accelerated our onboarding process.",
    author: 'Sarah Chen — CTO',
    link: '/customers/techstart'
  },
  {
    id: 'edutech',
    logo: 'https://cdn.prod.website-files.com/66e88746834b80507cdf7933/66ec7ff8ace31b63debbf4d9_Jasper.svg',
    video: 'https://dhygzobemt712.cloudfront.net/Web/home/2024-wxp/customers/outliant.mp4',
    poster: 'https://cdn.prod.website-files.com/66e88746834b80507cdf7933/66ec7faad1ba5dcf377b861c_outliant-bg.webp',
    stat: '85%',
    statDesc: 'completion rate',
    quote: "CodeTutor has transformed our computer science curriculum. Students are more engaged and show better understanding of complex programming concepts thanks to the interactive learning approach.",
    author: 'Dr. Michael Torres — Department Head',
    link: '/customers/edutech'
  },
  {
    id: 'devacademy',
    logo: 'https://cdn.prod.website-files.com/66e88746834b80507cdf7933/66ec7ff8a7ffdf748142d329_Fivetran.svg',
    video: 'https://dhygzobemt712.cloudfront.net/Web/home/2024-wxp/customers/fivetran.mp4',
    poster: 'https://cdn.prod.website-files.com/66e88746834b80507cdf7933/66ec7faad1ba5dcf377b861c_outliant-bg.webp',
    stat: '3x',
    statDesc: 'faster learning',
    quote: "Our students consistently report that CodeTutor's personalized learning paths and AI assistance help them grasp programming concepts three times faster than traditional methods.",
    author: 'Rachel Kim — Lead Instructor',
    link: '/customers/devacademy'
  }
];

const CustomerSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const sliderRef = useRef(null);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? customerData.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === customerData.length - 1 ? 0 : prev + 1));
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    const video = document.querySelector(`video[data-customer="${customerData[currentSlide].id}"]`);
    if (video) {
      isPlaying ? video.pause() : video.play();
    }
  };

  return (
    <section className="overflow-hidden py-24 bg-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-16">
          <div className="max-w-[34rem]">
            <h2 className="text-4xl md:text-5xl font-bold">
              The best startup companies build on here
            </h2>
          </div>
          <div className="hidden md:flex gap-4">
            <button 
              onClick={handlePrevSlide}
              className="p-4 hover:bg-gray-200 rounded-full transition-colors"
              aria-label="Previous slide"
            >
              <HiArrowLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={handleNextSlide}
              className="p-4 hover:bg-gray-200 rounded-full transition-colors"
              aria-label="Next slide"
            >
              <HiArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Slider */}
        <div className="relative overflow-hidden">
          <div 
            ref={sliderRef}
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {customerData.map((customer) => (
              <div 
                key={customer.id}
                className="w-full flex-shrink-0 relative"
              >
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  <video
                    data-customer={customer.id}
                    src={customer.video}
                    poster={customer.poster}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    playsInline
                    loop
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-8 flex flex-col">
                    <img 
                      src={customer.logo} 
                      alt="" 
                      className="h-12 w-auto mb-auto"
                    />
                    
                    <div className="sm:grid grid-cols-2 hidden items-end   gap-8 text-white">
                      <div>
                        <div className="text-6xl font-bold mb-2">{customer.stat}</div>
                        <div className="text-lg">{customer.statDesc}</div>
                      </div>
                      <div>
                        <p className="text-xl mb-4">{customer.quote}</p>
                        <div className="flex items-center justify-between">
                          <div className="text-lg">{customer.author}</div>
                          <button
                            onClick={togglePlayPause}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                          >
                            {isPlaying ? <BsPauseFill size={24} /> : <BsPlayFill size={24} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerSection;