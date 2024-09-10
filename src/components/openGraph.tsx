import React from "react";
import openGraph from "../assets/images/openGraph.jpg";

interface OpenGraphProps {
  title?: string;
  description?: string;
  imageUrl?: any;
}

const OpenGraph: React.FC<OpenGraphProps> = ({
  title = "Flix Finder",
  description = "Recherchez vos films préférés, trouvez des suggestions similaires et partagez vos découvertes avec vos amis.",
  imageUrl = {openGraph},
}) => {
  return (
    <>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
    </>
  );
};

export default OpenGraph;
