import { Link, useLocation } from "react-router-dom";

export default function LayoutsFooter() {
  const location = useLocation();

  return (
    <footer className="fixed bottom-0 left-0 z-50 w-full h-14 bg-black/80 backdrop-blur-3xl lg:hidden">
      <div className="grid h-full max-w-lg grid-cols-3 mx-auto font-medium">
        <Link
          to="/popular"
          className={`inline-flex flex-col items-center justify-center px-5 text-xl ${
            location.pathname === "/popular" || location.pathname === "/forYou" ? "text-white" : "text-zinc-500"
          } hover:text-white group`}
        >
          <i
            className={`ri-home-5-line ${
              location.pathname === "/popular" || location.pathname === "/forYou" ? "text-white" : "text-zinc-500"
            }`}
          ></i>
          <span className="text-xs">Accueil</span>
        </Link>
        <Link
          to="/favorites"
          className={`inline-flex flex-col items-center justify-center px-5 text-xl ${
            location.pathname === "/favorites" ? "text-white" : "text-zinc-500"
          } hover:text-white group`}
        >
          <i
            className={`ri-heart-add-line ${
              location.pathname === "/favorites"
                ? "text-white"
                : "text-zinc-500"
            }`}
          ></i>
          <span className="text-xs">Favoris</span>
        </Link>
        <Link
          to="/search"
          className={`inline-flex flex-col items-center justify-center px-5 text-xl ${
            location.pathname === "/search" ? "text-white" : "text-zinc-500"
          } hover:text-white group`}
        >
          <i
            className={`ri-search-line ${
              location.pathname === "/search" ? "text-white" : "text-zinc-500"
            }`}
          ></i>
          <span className="text-xs">Recherche</span>
        </Link>
      </div>
    </footer>
  );
}
