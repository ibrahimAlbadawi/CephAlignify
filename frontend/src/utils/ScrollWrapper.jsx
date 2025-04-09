import { useEffect, useRef } from "react";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";

const ScrollWrapper = ({ children }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const scroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      lerp: 0.04, // optional, for smoother inertia
    });

    return () => {
      scroll.destroy();
    };
  }, []);

  return (
    <div
      ref={scrollRef}
      data-scroll-container
      style={{
        minHeight: "100vh",
        overflow: "hidden", // let locomotive handle scroll
      }}
    >
      {children}
    </div>
  );
};

export default ScrollWrapper;