import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import defaultPerson from "../assets/images/no_image.jpg";
import { MovieService } from "../services/movie.service";
import MovieDetailSkeleton from "./skeleton";

const movieService = new MovieService();

const PersonDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [person, setPerson] = useState<any | null>(null);
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllMovies, setShowAllMovies] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPersonDetails = async () => {
      setLoading(true);
      try {
        const personData = await movieService.fetchPersonById(Number(id));
        const movieCredits = await movieService.fetchPersonMovieCredits(
          Number(id)
        );
        setPerson(personData);
        setMovies(movieCredits.cast);
      } catch (error) {
        console.error("Error fetching person details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonDetails();
  }, [id]);

  if (loading || !person) {
    return <MovieDetailSkeleton />;
  }

  const bioToDisplay = person.biography
    ? showFullBio
      ? person.biography
      : `${person.biography.substring(0, 300)}${
          person.biography.length > 300 ? "..." : ""
        }`
    : "Aucune biographie disponible.";

  return (
    <>
      <div className="fixed top-0 left-0 z-50 w-full h-16 p-2 bg-zinc-900 lg:hidden">
        <button
          onClick={() => navigate(-1)}
          className="w-12 h-12 text-2xl rounded-full shadow bg-zinc-800 text-zinc-300 focus:outline-none md:hover:bg-zinc-700"
        >
          <i className="ri-arrow-left-line"></i>
        </button>
      </div>
      <div className="flex flex-col items-center min-h-screen p-4 my-14 text-white md:mb-0 bg-zinc-900 md:mx-auto md:max-w-[1000px] lg:mt-16">
        <div className="relative w-full mb-4 md:max-w-lg">
          <img
            src={
              person.profile_path
                ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
                : defaultPerson
            }
            alt={person.name}
            className="object-cover w-full h-auto rounded md:max-w-48 md:h-72 md:mx-auto"
          />
        </div>

        <div className="flex items-center justify-start w-full md:w-auto md:justify-center">
          <div className="w-full mb-4">
            <h1 className="mb-4 text-3xl font-bold">{person.name}</h1>
            <div className="mb-4">
              <p className="font-semibold text-zinc-300">Célèbre pour :</p>
              <p className="text-zinc-400">{person.known_for_department}</p>
            </div>
            <div className="mb-4">
              <p className="font-semibold text-zinc-300">Date de naissance :</p>
              <p className="text-zinc-400">{person.birthday || "N/A"}</p>
            </div>
            <div className="mb-4">
              <p className="font-semibold text-zinc-300">Lieu de naissance :</p>
              <p className="text-zinc-400">{person.place_of_birth || "N/A"}</p>
            </div>
          </div>
        </div>

        <p className="mb-4 text-zinc-400">
          {bioToDisplay}
          {person.biography && person.biography.length > 300 && (
            <span
              onClick={() => setShowFullBio(!showFullBio)}
              className="ml-2 font-medium text-blue-400 cursor-pointer hover:underline"
            >
              {showFullBio ? "Afficher moins" : "Afficher plus"}
            </span>
          )}
        </p>

        <div className="w-full mt-8">
          <h2 className="mb-4 text-2xl font-semibold">Films</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {(showAllMovies ? movies : movies.slice(0, 8)).map((movie: any) => (
              <Link to={`/movie/${movie.id}`} key={movie.id}>
                <div className="relative">
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : defaultPerson
                    }
                    alt={movie.title}
                    className="object-cover w-full rounded-md h-52 md:h-72"
                  />
                  <div className="w-full p-1 mt-2 text-sm font-semibold text-center text-white bg-zinc-900 bg-opacity-80">
                    <p>{movie.title}</p>
                    <p className="text-xs text-zinc-400">
                      Sorti en {movie.release_date.toString().slice(0, 4)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex items-center justify-center">
            {movies.length > 8 && (
              <button
                onClick={() => setShowAllMovies(!showAllMovies)}
                className="px-4 py-2 mt-4 font-medium text-white rounded-full shadow bg-zinc-800"
              >
                {showAllMovies ? (
                  <span>
                    Afficher moins
                    <i className="ml-2 text-lg ri-arrow-up-s-line"></i>
                  </span>
                ) : (
                  <span>
                    Afficher plus
                    <i className="ml-2 text-lg ri-arrow-down-s-line"></i>
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PersonDetails;
