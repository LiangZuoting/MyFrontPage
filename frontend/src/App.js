import './App.css';
import Search from "./Search";
import Weather from "./Weather";
import Websites from "./Websites";
import History from "./History";

function App() {
  return (
    <div className="App">
        <Weather />
        <Search />
        <Websites />
        <History />
    </div>
  );
}

export default App;
