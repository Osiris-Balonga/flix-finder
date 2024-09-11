import { MovieModel } from "../models/movie.model";

export const toggleLike = (
  movieId: number,
  likedMovies: { [key: number]: boolean }
) => {
  const updated = { ...likedMovies };
  const isLiked = !!likedMovies[movieId];

  if (isLiked) {
    delete updated[movieId];
  } else {
    updated[movieId] = true;
  }
  localStorage.setItem("likedMovies", JSON.stringify(updated));
  return updated;
};

export const shareMovie = (movie: MovieModel) => {
  const shareData = {
    title: movie.title,
    text: `Découvrez ce film incroyable : ${movie.description}`,
    url: `https://my-flix-finder.netlify.app/movie/${movie.id}`,
  };

  if (navigator.share) {
    navigator.share(shareData).catch((error) => {
      console.error("Erreur lors du partage:", error);
    });
  } else {
    navigator.clipboard.writeText(shareData.url).then(() => {
      alert("Lien copié dans le presse-papier !");
    });
  }
};

export const getGenreName = (id: number): string => {
  const genres: { [key: number]: string } = {
    28: "Action",
    12: "Aventure",
    16: "Animation",
    35: "Comédie",
    80: "Crime",
    99: "Documentaire",
    18: "Drame",
    10751: "Familial",
    14: "Fantastique",
    36: "Histoire",
    27: "Horreur",
    10402: "Musique",
    9648: "Mystère",
    10749: "Romance",
    878: "Science-Fiction",
    10770: "Téléfilm",
    53: "Thriller",
    10752: "Guerre",
    37: "Western",
  };
  return genres[id] || "Genre Inconnu";
};
