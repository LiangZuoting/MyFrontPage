import {useEffect, useState} from "react";

function WordWidget(props) {
    return (
        <div style={{background: "linear-gradient(45deg, lightgray, transparent)", fontSize: "16px"}}>
            <a href={`https://cn.bing.com/dict/search?q=${props.word}`} target={"_blank"}>{props.word}</a>
            <div>
                {props.meanings}
            </div>
        </div>
    )
}

export default function EnglishWordsWidget() {
    const [words, setWords] = useState([]);

    useEffect(() => {
        handleGetWords();
    }, []);

    function handleGetWords() {
        fetch(`/api/english/words`).then(resp => resp.json()).then(data => {
            if (data.ret === 200) {
                setWords(data.data);
            }
        });
    }

    return (
        <div style={{margin: "50px 200px 0 200px"}}>
            <div style={{display: "flex"}}>
                <h2>背个单词</h2>
                <button style={{marginLeft: "10px", color: "red", background: "transparent", border: "none", cursor: "pointer"}} onClick={handleGetWords}>换一批</button>
            </div>
            <div style={{display: "flex"}}>
                {
                    words.map((word, index) => (
                        <WordWidget key={index} word={Object.keys(word)[0]} meanings={word[Object.keys(word)[0]]}/>
                    ))
                }
            </div>
        </div>
    );
}