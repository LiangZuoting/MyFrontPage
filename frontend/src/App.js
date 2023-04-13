import './App.css';
import Search from "./Search";
import Websites from "./Websites";
import News from "./News";
import Weather from "./Weather";

function App() {
  return (
    <div className="App">
        <Weather />
        <Search />
        <Websites />
        <News />
    </div>
  );
}

export default App;
