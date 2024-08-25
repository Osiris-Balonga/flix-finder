import React, { useEffect, useState } from "react";
import { Subject, Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import noData from "../../assets/images/no-data.png";
import noImage from "../../assets/images/no_image.jpg";
import { MovieModel } from "../../models/movie.model";
import { MovieService } from "../../services/movie.service";
import ListCard from "../../shared/components/listCard";
import ListSkeleton from "../../shared/components/listSkeleton";
import { getGenreName } from "../../utils/movieUtils";

const movieService = new MovieService();

const MovieSearch: React.FC = () => {
  const [movies, setMovies] = useState<MovieModel[]>([]);
  const [searchTerms] = useState(new Subject<string>());
  const [searchTerm, setSearchTerm] = useState("");
  const [likedMovies, setLikedMovies] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [noResultsMessage, setNoResultsMessage] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    movieService.fetchGenres().then((genres) => {
      setGenres(genres);
    });

    const savedLikedMovies = localStorage.getItem("likedMovies");
    if (savedLikedMovies) {
      setLikedMovies(JSON.parse(savedLikedMovies));
    }
  }, []);

  useEffect(() => {
    const subscription: Subscription = searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => {
          setIsLoading(true);
          setHasSearched(true);
          return movieService
            .searchMovies(term)
            .then(async (results: any[]) => {
              const filteredResults = selectedGenre
                ? results.filter((movie) =>
                    movie.genre_ids.includes(selectedGenre)
                  )
                : results;

              const moviesWithVideos = await Promise.all(
                filteredResults.map(async (movie: any) => {
                  const rating = movie.vote_average
                    ? movie.vote_average / 2
                    : 0;
                  const videoData = await movieService.fetchMovieVideos(
                    movie.id
                  );
                  const video = videoData.results.find(
                    (vid: any) => vid.type === "Trailer"
                  );
                  const videoUrl = video
                    ? `https://www.youtube.com/watch?v=${video.key}`
                    : "";

                  return {
                    id: movie.id,
                    title: movie.title,
                    image: movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : noImage,
                    rating: isNaN(rating) ? 0 : rating,
                    genres: movie.genre_ids.map((genreId: number) =>
                      getGenreName(genreId)
                    ),
                    description: movie.overview,
                    videoUrl,
                    releaseDate: movie.release_date || "",
                    producers: [],
                    cast: [],
                  } as MovieModel;
                })
              );

              setIsLoading(false);

              if (moviesWithVideos.length === 0) {
                setNoResultsMessage("Aucun résultat trouvé");
              } else {
                setNoResultsMessage("");
              }

              return moviesWithVideos;
            })
            .catch(() => {
              setIsLoading(false);
              return [];
            });
        })
      )
      .subscribe({
        next: (results: MovieModel[]) => {
          setMovies(results);
        },
        error: (err) => {
          console.error("Erreur lors de la recherche de films:", err);
          setIsLoading(false);
        },
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [searchTerms, selectedGenre]);

  useEffect(() => {
    if (searchTerm) {
      searchTerms.next(searchTerm);
    }
  }, [selectedGenre]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    if (term) {
      setHasSearched(true);
    } else {
      setHasSearched(false);
    }
    searchTerms.next(term);
  };

  const handleGenreClick = (genreId: number) => {
    if (selectedGenre === genreId) {
      setSelectedGenre(null);
    } else {
      setSelectedGenre(genreId);
    }
    searchTerms.next(searchTerm);
  };

  return (
    <div className="w-full px-2 mt-16 bg-zinc-900 lg:max-w-[1000px] lg:mx-auto">
      <input
        type="text"
        placeholder="Rechercher un film..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full p-2 mb-4 text-white border rounded-lg bg-zinc-700 border-zinc-600 focus:outline-none"
      />
      <div className="flex flex-wrap mt-2">
        {genres.map((genre) => (
          <span
            key={genre.id}
            className={`px-2 py-1 mb-2 mr-1 text-xs text-white cursor-pointer rounded-xl ${
              selectedGenre === genre.id ? "bg-zinc-500" : "bg-zinc-800"
            } hover:bg-zinc-600`}
            onClick={() => handleGenreClick(genre.id)}
          >
            {genre.name}
          </span>
        ))}
      </div>
      {isLoading ? (
        <ListSkeleton />
      ) : hasSearched && noResultsMessage ? (
        <div className="flex flex-col items-center justify-center mt-4">
          <img src={noData} className="max-w-60" alt="No data" />
          <div className="mt-2 text-white">{noResultsMessage}</div>
        </div>
      ) : (
        <ul className="divide-y divide-zinc-700">
          {movies.map((movie) => (
            <ListCard
              to={`/search/${movie.id}`}
              key={movie.id}
              movie={movie}
              likedMovies={likedMovies}
              setLikedMovies={setLikedMovies}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default MovieSearch;
