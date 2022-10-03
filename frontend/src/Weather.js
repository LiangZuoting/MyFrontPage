import {useEffect, useState} from "react";
import {Space} from "antd";

function Location(props) {
    return <div style={{height: "fit-content", margin: "auto 0"}}>
        {
            `${props.province} ${props.city} ${props.area}`
        }
    </div>
}

function DayWeather(props) {
    return (
        <div>
            <div>
                {props.date} 星期{props.week}
            </div>
            <div>
                农历 {props.nongli}
            </div>
            <div>
                {props.weather}
            </div>
            <div>
                {props.temperature}℃
            </div>
            <div>
                {props.wind_direction} {props.wind_power}
            </div>
            <div>
                日出：{props.sunrise} 日落：{props.sunset}
            </div>
            <div>
                空气质量：{props.aqi} {props.quality}
            </div>
        </div>
    );
}

function LocationWeather(props) {
    return (
        <div style={{display: "flex", width: "fit-content", margin: "10px auto 0 auto"}}>
            <Location {...props.data.location}/>
            <Space size={24}>
                {
                    props.data.weather.map((item, index) => <DayWeather key={index} {...item}/>)
                }
            </Space>
        </div>
    );
}

export default function Weather() {

    const [data, setData] = useState(null);

    useEffect(() => {
        fetch("/api/weatherforecast").then(response => response.json()).then(data => {
            setData(data);
        });
    }, []);

    if (!data || data.ret !== 0) {
        return <div></div>;
    }
    return (
        <div>
            {
                data.data.map((item, index) => <LocationWeather key={index} {...item} />)
            }
        </div>
    );
}