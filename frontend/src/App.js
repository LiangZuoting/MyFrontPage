import './App.css';
import Search from "./Search";
import Weather from "./Weather";
import Websites from "./Websites";
import History from "./History";
import News from "./News";

function App() {
  return (
    <div className="App">
        <Weather />
        <Search />
        <Websites />
        <History />
        <News />
    </div>
  );
}

export default App;
