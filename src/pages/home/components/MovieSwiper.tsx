import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { useSwiperNavigation } from "../../../hooks/useSwiperNavigation";
import { MovieModel } from "../../../models/movie.model";
import MovieCard from "./movieCard";
import Skeleton from "./skeleton";

interface MovieSwiperProps {
  movies: MovieModel[];
  isLoading: boolean;
  likedMovies: { [key: number]: boolean };
  onToggleLike: (likedMovies: { [key: number]: boolean }) => void;
  onSlideChange: (swiper: any) => void;
}

export default function MovieSwiper({
  movies,
  isLoading,
  likedMovies,
  onToggleLike,
  onSlideChange,
}: MovieSwiperProps) {
  const swiperRef = useSwiperNavigation();

  return (
    <Swiper
      direction={"vertical"}
      className="w-full h-full"
      onSlideChange={onSlideChange}
      ref={swiperRef}
    >
      {movies.map((movie) => (
        <SwiperSlide
          key={movie.id}
          className="flex flex-col items-center justify-center w-full h-full text-white bg-black/60 backdrop-blur-xl"
        >
          <div className="absolute inset-0">
            <img
              src={movie.image}
              alt={movie.title}
              className="object-cover w-full h-full filter blur-sm"
              style={{ filter: "blur(12px)" }}
            />
            <div className="absolute inset-0 bg-black opacity-60"></div>
          </div>
          <div className="flex items-center justify-center h-full">
            <MovieCard
              to={`/movie/${movie.id}`}
              movie={movie}
              likedMovies={likedMovies}
              onToggleLike={onToggleLike}
            />
          </div>
        </SwiperSlide>
      ))}
      {isLoading && (
        <SwiperSlide className="flex items-center justify-center w-full h-full bg-black/60 backdrop-blur-xl">
          <Skeleton />
        </SwiperSlide>
      )}
    </Swiper>
  );
}
