import "./App.css";
import OpenGraph from "./components/openGraph";
import LayoutsMain from "./layouts/layouts-main";

export const Head = () => {
  return <OpenGraph />;
};

function App() {
  return <LayoutsMain />;
}

export default App;
