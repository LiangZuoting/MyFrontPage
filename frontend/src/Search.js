import {Button, Input, Space} from 'antd';
import {useState} from "react";

export default function Search() {

    const [text, setText] = useState("");

    function google() {
        window.open("https://www.google.com/search?q=" + encodeURIComponent(text), "_blank");
    }

    function bing() {
        window.open("https://cn.bing.com/search?q=" + encodeURIComponent(text), "_blank");
    }

    function baidu() {
        window.open("https://www.baidu.com/s?wd=" + encodeURIComponent(text), "_blank");
    }

    function github() {
        window.open("https://www.github.com/search?q=" + encodeURIComponent(text), "_blank");
    }

    function chatGPT() {
        document.location.assign(`/chatgpt?question=${encodeURIComponent(text)}`);
    }

    function handleChange(e) {
        setText(e.target.value);
    }

    function handleEnter(e) {
        google(text);
        bing(text);
    }

    return (
        <div style={{margin: "50px 200px 0 200px"}}>
            <Input size={"large"} placeholder={"Search Something..."} allowClear onChange={handleChange} onPressEnter={handleEnter} />
            <div style={{textAlign: "right", marginTop: "2px"}}>
                <Space>
                    <Button onClick={google}>Google</Button>
                    <Button onClick={bing}>Bing</Button>
                    <Button onClick={baidu}>Baidu</Button>
                    <Button onClick={github}>Github</Button>
                    <Button onClick={chatGPT}>ChatGPT</Button>
                </Space>
            </div>
        </div>
    );
}