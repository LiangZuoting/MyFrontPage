import {useEffect, useState} from "react";

function News({news}) {
    return (
        <div style={{margin: "6px 0"}}>
            <a href={news.url} target={"_blank"}>{news.title}</a>
        </div>
    )
}

function CategoricalNews({category, news}) {
    return (
        <div>
            <h3>{category}</h3>
            {
                news.map((n, i) => (<News key={i} news={n}/>))
            }
        </div>
    )
}

export default function AllNews() {
    const [news, setNews] = useState([]);

    useEffect(() => {
        setTimeout(() => {
        fetch("/api/news").then(res => res.json()).then(data => {
            setNews(data["news"])
        });
    }, 1000);
    }, []);

    return (
        <div>
        <h2>新闻</h2>
            {
                news.map((n, i) => (
                    <CategoricalNews key={i} category={n["category"]} news={n["news"]}/>
                ))
            }
        </div>

    )
}