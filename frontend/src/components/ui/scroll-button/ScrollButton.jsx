import React, { useState, useEffect } from "react";

const ScrollButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollPosition = window.innerHeight + window.pageYOffset;
      if (scrollHeight - scrollPosition > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    toggleVisibility();

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  return isVisible ? (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        onClick={scrollToBottom}
        className="relative flex items-center gap-2 px-5 py-3 bg-[rgba(20,20,40,0.8)] border border-[rgba(255,255,255,0.1)] rounded-full text-white font-medium text-sm cursor-pointer transition-all duration-200 backdrop-blur-[8px] hover:bg-[rgba(30,30,50,0.9)] hover:border-[rgba(255,255,255,0.2)]"
      >
        <span className="font-medium">Scroll down</span>
        <svg
          className="transform translate-y-[1px] transition-transform duration-200 group-hover:translate-y-[2px]"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 4L6 8L10 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="absolute inset-[-1px] rounded-full p-[1px] bg-gradient-to-br from-[rgba(111,63,245,0.4)] to-[rgba(111,63,245,0)] mask-[linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] mask-composite-exclude opacity-0 transition-opacity duration-200 hover:opacity-100"></div>
      </button>
    </div>
  ) : null;
};

export default ScrollButton;
