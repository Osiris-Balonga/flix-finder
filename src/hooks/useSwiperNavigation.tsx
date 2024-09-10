import { useEffect, useRef } from "react";

export function useSwiperNavigation() {
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        swiperRef.current.swiper.slidePrev();
      } else if (event.key === "ArrowDown") {
        swiperRef.current.swiper.slideNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return swiperRef;
}
