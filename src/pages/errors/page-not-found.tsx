import { useNavigate } from "react-router-dom";
import pageNotFound from "../../assets/images/pageNotFound.png";

function PageNotFound() {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <div className="">
          <img className="w-60 md:w-80" src={pageNotFound} alt="" />
          <div className="mt-4 text-center text-zinc-400">
            <h1 className="mb-4 text-6xl font-semibold text-red-600">404</h1>
            <p className="mb-1 text-lg">Oops! Page introuvable.</p>
            <p>
              Retourner à la{" "}
              <span
                onClick={() => navigate(-1)}
                className="font-bold text-white cursor-pointer"
              >
                page précédante.
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default PageNotFound;
