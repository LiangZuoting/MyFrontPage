import {useEffect, useState} from "react";

export default function History() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch('/api/history/today').then(res => res.json()).then(data => {
            setData(data);
        });
    }, []);

    return (
      <div style={{margin: "50px 200px 0 200px", textAlign: "left"}}>
          <h2>历史上的今天</h2>
          {
              data && data.data.map((item, index) => (
                  <div key={index} style={{display: "inline"}}>
                      <div>
                          {item.title}
                      </div>
                      <div>
                          {item.content}
                      </div>
                  </div>
              ))
          }
      </div>
    );
}