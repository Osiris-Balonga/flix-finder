import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import PersonDetails from "../components/personDetails";
import MovieDetails from "../components/movieDetails";
import ErrorPage from "../pages/errors/error-page";
import PageNotFound from "../pages/errors/page-not-found";
import LikedMovies from "../pages/favorites/favorites";
import ForYouPage from "../pages/home/forYouPage";
import PopularMovies from "../pages/home/popularMovies";
import MovieSearch from "../pages/movieSearch/movieSearch";
import LayoutsFooter from "./layouts-footer";
import LayoutsHeader from "./layouts-header";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: <Root />,
    children: [
      {
        index: true,
        element: <Navigate to="/popular" replace />,
      },
      {
        path: "/popular",
        element: <PopularMovies />,
      },
      {
        path: "/forYou",
        element: <ForYouPage />,
      },
      {
        path: "/movie/:id",
        element: <MovieDetails />,
      },
      {
        path: "/person/:id",
        element: <PersonDetails />,
      },
      {
        path: "/favorites",
        element: <LikedMovies />,
      },
      {
        path: "/search",
        element: <MovieSearch />,
      },
      {
        path: "/*",
        element: <PageNotFound />,
      },
    ],
  },
  {
    path: "/*",
    element: <PageNotFound />,
  },
]);

function Root() {
  return (
    <>
      <LayoutsHeader />
      <main>
        <Outlet />
      </main>
      <LayoutsFooter />
    </>
  );
}

function LayoutsMain() {
  return <RouterProvider router={router} />;
}

export default LayoutsMain;
