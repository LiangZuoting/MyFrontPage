import './App.css';
import Search from "./Search";
import Weather from "./Weather";
import Websites from "./Websites";
import News from "./News";

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
