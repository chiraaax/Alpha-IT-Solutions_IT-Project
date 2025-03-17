import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'; // Ensure you're using 'react-router-dom' for routing
import { HiArrowRight } from 'react-icons/hi';
import { BsPlayFill, BsPauseFill } from 'react-icons/bs';

const tabsData = [
  {
    id: 'tab1',
    title: 'Unleash Your Gaming Potential',
    subtitle: 'Fine-tune every detail of your gaming setup, from powerhouse GPUs to lightning-fast SSDs, for an unparalleled experience that crushes lag and elevates every match.',
    video: 'https://res.cloudinary.com/dovdejenw/video/upload/v1742242404/Video%20Files/Custom%20Build/klhr8jxbqsjhhr2is0de.mp4',
    poster: 'https://cdn.prod.website-files.com/66e88746834b80507cdf7933/670570322cf4b274d716fed4_design-without-limits.avif',
    cta: {
      text: 'Discover Custom Builds',
      link: '/custom-prebuilds'
    }
  },
  {
    id: 'tab2',
    title: 'Power Your Passion',
    subtitle: 'Transform your gaming experience adapts to your needs. choose the processor, graphics, and accessories that help you elevate your gameplay to the next level.',
    video: 'https://res.cloudinary.com/dovdejenw/video/upload/v1742242434/Video%20Files/Custom%20Build/g2yhhfmv0hna7fskfxkh.mp4',
    poster: 'https://cdn.prod.website-files.com/66e88746834b80507cdf7933/67057032ad30932a68cd9d18_animations.avif',
    cta: {
      text: 'Discover Performance',
      link: '/custom-prebuilds'
    }
  },
  {
    id: 'tab3',
    title: 'Efficiency Meets Affordability',
    subtitle: 'Don’t sacrifice quality for cost. With customizable budget pre-builds, you can achieve high-speed performance for work, school, or casual gaming without the hefty price tag.',
    video: 'https://res.cloudinary.com/dovdejenw/video/upload/v1742242473/Video%20Files/Custom%20Build/ymqbpqcb4oaw22ctr4wj.mp4',
    poster: 'https://cdn.prod.website-files.com/66e88746834b80507cdf7933/67058d52036e5522e27966de_build-on-brand.avif',
    cta: {
      text: 'Discover Balanced Efficiency',
      link: '/custom-prebuilds'
    }
  },
  {
    id: 'tab4',
    title: 'Performance on a Budget',
    subtitle: "Achieve reliable performance for both productivity and light gaming with carefully selected components, offering the best value for money without compromising on quality..",
    video: 'https://res.cloudinary.com/dovdejenw/video/upload/v1742242504/Video%20Files/Custom%20Build/zwklhvss0xmo06ceexvy.mp4',
    poster: 'https://cdn.prod.website-files.com/66e88746834b80507cdf7933/670570323f08ce0aed3368e4_ai-assistant.avif',
    cta: {
      text: 'Discover Gaming Solutions',
      link: '/custom-prebuilds'
    }
  },
  {
    id: 'tab5',
    title: 'Empower Your Work & Play',
    subtitle: "From office productivity to light gaming, create a system that is fully tailored to your needs, offering the perfect balance of performance and affordability.",
    video: 'https://res.cloudinary.com/dovdejenw/video/upload/v1742242531/Video%20Files/Custom%20Build/pifmkd6mrlhgvr1vvxqo.mp4',
    poster: 'https://cdn.prod.website-files.com/66e88746834b80507cdf7933/670570323f08ce0aed3368e4_ai-assistant.avif',
    cta: {
      text: 'Discover Ultimate Performance',
      link: '/custom-prebuilds'
    }
  },
  {
    id: 'tab6',
    title: 'Craft Your Dream PC Today',
    subtitle: "Choose the perfect combination of power, speed, and efficiency with our customizable pre-builds. Upgrade and adjust your PC to meet your needs and budget without compromise.",
    video: 'https://res.cloudinary.com/dovdejenw/video/upload/v1742242556/Video%20Files/Custom%20Build/qlew0fmhhge5bhbbqodk.mp4',
    poster: 'https://cdn.prod.website-files.com/66e88746834b80507cdf7933/670570323f08ce0aed3368e4_ai-assistant.avif',
    cta: {
      text: 'Discover your Dream PC',
      link: '/custom-prebuilds'
    }
  }
];

const DesignSection = () => {
  const [activeTab, setActiveTab] = useState('tab1');
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef(null);
  const PROGRESS_DURATION = 10000; // 10 seconds for each tab
  const UPDATE_INTERVAL = 100; // Update progress every 100ms

  useEffect(() => {
    startProgressTimer();
    return () => clearInterval(progressInterval.current);
  }, [activeTab]);

  const startProgressTimer = () => {
    setProgress(0);
    clearInterval(progressInterval.current);

    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          // Move to next tab
          const currentIndex = tabsData.findIndex(tab => tab.id === activeTab);
          const nextIndex = (currentIndex + 1) % tabsData.length;
          setActiveTab(tabsData[nextIndex].id);
          return 0;
        }
        return prev + (UPDATE_INTERVAL / PROGRESS_DURATION * 100);
      });
    }, UPDATE_INTERVAL);
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setIsPlaying(true);
    setProgress(0);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    const video = document.querySelector(`video[data-tab="${activeTab}"]`);
    if (video) {
      if (isPlaying) {
        video.pause();
        clearInterval(progressInterval.current);
      } else {
        video.play();
        startProgressTimer();
      }
    }
  };

  // Function to handle scrolling to the top when navigating
  const handleCustomPreBuildsClick = () => {
    window.scrollTo(0, 0); // Scroll to the top when clicking the Custom Pre-builds link
  };

  return (
    <section className="overflow-hidden py-24 bg-gradient-to-r from-gray-900 via-blue-900 to-white dark:from-black dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        {/* Header Section */}
        <div className="max-w-[50rem] lg:mb-24 mb-16">
          <h2 className="text-6xl md:text-7xl font-bold text-white mb-8">
          Your Build - Your Rules
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className='flex flex-col justify-between gap-16'>
            {/* paragraph and button */}
            
              <p className="text-2xl text-gray-300">
              Unlock solid performance without the high price tag. Choose from budget-friendly yet powerful components that don’t compromise on quality. Get the most out of your PC, perfectly tailored to your needs and budget.
              </p>          
              
              <div className="flex mt-8 justify-self-center lg:justify-self-start gap-8 items-center flex-col lg:flex-row lg:gap-8 lg:items-start lg:mt-0 lg:mb-8"> 
                {/* Custom Pre-builds Button with scroll to top behavior */}
                <Link
                  to="/custom-prebuilds"
                  onClick={handleCustomPreBuildsClick} // Trigger scroll to top on click
                  className="bg-gradient-to-r from-gray-900 via-blue-500 to-blue-1000 min-w-90 text-gray-100 flex flex-col items-center p-4 text-lg rounded-lg shadow-lg hover:bg-gradient-to-r hover:from-gray-900 hover:via-blue-500 hover:to-blue-1000 cursor-pointer transition-transform transform hover:scale-105"
                >
                  <div className="mt-2 text-3xl italic font-bold">Custom Pre-builds</div>
                  <p className="text-gray-200">- Build your dream PC -</p>
                </Link>
              </div>
              
                       

            {/* Tabs Section */}
            <div className="space-y-6">
              {tabsData.map((tab) => (
                <div
                  key={tab.id}
                  className="relative pl-4 cursor-pointer"
                  onClick={() => handleTabClick(tab.id)}
                >
                  {/* Progress bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-800">
                    {activeTab === tab.id && (
                      <div 
                        className="absolute top-0 left-0 w-full bg-rose-600 transition-all duration-100"
                        style={{ height: `${progress}%` }}
                      />
                    )}
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-2">
                    {tab.title}
                  </h3>
                  <p className={`text-gray-400 transition-all duration-300 ${
                    activeTab === tab.id ? 'h-auto opacity-100' : 'h-0 opacity-0 overflow-hidden'
                  }`}>
                    {tab.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Video Display */}
          <div className="relative">
            <div className="max-w-[700px] mx-auto">
              {tabsData.map((tab) => (
                <div
                  key={tab.id}
                  className={`transition-opacity duration-500 ${
                    activeTab === tab.id ? 'opacity-100' : 'opacity-0 hidden'
                  }`}
                >
                  <video
                    data-tab={tab.id}
                    src={tab.video}
                    poster={tab.poster}
                    className="w-full rounded-lg"
                    autoPlay
                    muted
                    playsInline
                    loop
                  />
                  <div className="flex items-center justify-between mt-4">
                    <Link 
                      to={tab.cta.link}
                      className="inline-flex items-center text-white hover:text-gray-300 transition-colors"
                    >
                      {tab.cta.text}
                      <HiArrowRight className="ml-2" />
                    </Link>
                    <button
                      onClick={togglePlayPause}
                      className="p-2 text-white hover:text-gray-300"
                    >
                      {isPlaying ? <BsPauseFill size={24} /> : <BsPlayFill size={24} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DesignSection;