import { Link, useLocation } from "react-router-dom";

const pageTitles: { [key: string]: string } = {
  "/popular": "",
  "/forYou": "",
  "/favorites": "Favoris",
  "/search": "Recherche",
};

export default function LayoutsHeader() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <header className="fixed top-0 left-0 z-50 w-full p-4 bg-transparent">
      <div className="flex items-center justify-between lg:hidden">
        {currentPath === "/popular" || currentPath === "/forYou" ? (
          <>
            <Link
              to="/popular"
              className={`font-semibold text-md ${
                currentPath === "/popular" ? "text-white" : "text-slate-400"
              }`}
            >
              Populaires
            </Link>
            <Link
              to="/forYou"
              className={`font-semibold text-md ${
                currentPath === "/forYou" ? "text-white" : "text-slate-400"
              }`}
            >
              Pour toi
            </Link>
          </>
        ) : (
          <h1 className="font-semibold text-white text-md">
            {pageTitles[currentPath] || ""}
          </h1>
        )}
      </div>

      <div className="hidden lg:flex lg:w-full lg:justify-between lg:max-w-[1000px] lg:mx-auto">
        <Link
          to="/popular"
          className={`font-semibold text-md ${
            currentPath === "/popular" ? "text-white" : "text-slate-400"
          }`}
        >
          Populaires
        </Link>
        <Link
          to="/forYou"
          className={`font-semibold text-md ${
            currentPath === "/forYou" ? "text-white" : "text-slate-400"
          }`}
        >
          Pour toi
        </Link>
        <Link
          to="/favorites"
          className={`font-semibold text-md ${
            currentPath === "/favorites" ? "text-white" : "text-slate-400"
          }`}
        >
          Favoris
        </Link>
        <Link
          to="/search"
          className={`font-semibold text-md ${
            currentPath === "/search" ? "text-white" : "text-slate-400"
          }`}
        >
          Recherche
        </Link>
      </div>
    </header>
  );
}
