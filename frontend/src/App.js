import './App.css';
import Search from "./Search";
import Websites from "./Websites";
import News from "./News";
import Weather from "./Weather";
import EnglishWordsWidget from "./EnglishWordsWidget";

function App() {
  return (
    <div className="App">
        <Weather />
        <EnglishWordsWidget />
        <Search />
        <Websites />
        <News />
    </div>
  );
}

export default App;
