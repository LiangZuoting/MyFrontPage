import './App.css';
import Search from "./Search";
import Weather from "./Weather";
import Websites from "./Websites";

function App() {
  return (
    <div className="App">
        <Weather />
        <Search />
        <Websites />
    </div>
  );
}

export default App;
