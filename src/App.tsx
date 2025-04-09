import "./App.css";
import { SystemProvider } from "./contexts/systemContext";
import Map from "./components/Map";

function App() {
  return (
    <SystemProvider>
      <Map />
    </SystemProvider>
  );
}

export default App;
