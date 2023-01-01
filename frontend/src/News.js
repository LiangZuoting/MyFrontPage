import {useEffect, useState} from "react";

function ChannelNews({news}) {
    return (
        <div style={{display: "inline", marginRight: "20px"}}>
            <a href={news.url} target={"_blank"}>{`${news.media}: ${news.title}`}</a>
        </div>
    );
}

function Channel({channel}) {
    if (!channel.data) {
        return <div></div>;
    }
    return (
        <div>
            <h3>{channel.channel}</h3>
            {
                channel.data.map((news, index) => (
                    <ChannelNews key={index} news={news}/>
                ))
            }
        </div>
    );
}

export default function News() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch('/api/news').then(res => res.json()).then(data => {
            setData(data);
        });
    }, []);

    if (!data || data.ret || !data.data) {
        return <div></div>;
    }

    return (<div style={{margin: "50px 200px 0 200px"}}>
        <h2>热点新闻</h2>
        {
            data.data.map((item, index) => (
                <Channel key={index} channel={item}/>
            ))
        }
    </div>);
}