import {useEffect, useState} from "react";

function DayWeather(props) {
    return (
        <div>
            <div>
                温度：{props.temp}
            </div>
            <div>
                今日：{props.temp_min}—{props.temp_max}
            </div>
            <div>
                湿度：{props.humidity}
            </div>
            <div>
                风速：{props.wind_speed}
            </div>
            <div>
                风向：{props.wind_direction}
            </div>
            {
                props.sunrise && <div>
                    日升：{props.sunrise}
                </div>
            }
            {
                props.sunset && <div>
                    日落：{props.sunset}
                </div>
            }
            <div>
                发布：{props.time}
            </div>
        </div>
    );
}

export default function Weather() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch(`/api/weather`).then(resp => resp.json()).then(data => {
           if (data.ret === 200) {
               setData(data);
           }
        });
    }, []);

    if (!data) {
        return null;
    }

    return (
        <div style={{display: "grid", gridAutoFlow: "column", margin: "20px 200px"}}>
            <DayWeather {...data['now']} />
            {
                data['forecast'].map((item, index) => (
                    <DayWeather key={index} {...item} />
                ))
            }
        </div>
    );
}