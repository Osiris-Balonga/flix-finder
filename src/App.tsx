import "./App.css";
import LayoutsMain from "./layouts/layouts-main";
import OpenGraph from "./shared/components/openGraph";

export const Head = () => {
  return <OpenGraph />;
}

function App() {
  return <LayoutsMain />;
}

export default App;
