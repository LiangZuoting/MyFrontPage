import {Button, Input} from "antd";
import {useEffect, useRef, useState} from "react";
import {useLocation, useSearchParams} from "react-router-dom";
import hljs from "highlight.js";
import 'highlight.js/styles/github.css';
import MarkdownIt from "markdown-it";

export default function ChatGPTQA() {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [inputValue, setInputValue] = useState("");
    const [asking, setAsking] = useState(false);
    const markdown = useRef();
    const question = searchParams.get('question');

    useEffect(() => {
        if (markdown.current) {
            return;
        }
        markdown.current = new MarkdownIt({
            highlight: function (str, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return '<pre class="hljs"><code>' +
                            hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                            '</code></pre>';
                    } catch (__) {
                    }
                }
                return '<pre class="hljs"><code>' + hljs.highlightAuto(str).value + '</code></pre>';
            }
        });
    }, []);

    useEffect(() => {
        if (!question) {
            return;
        }
        if (searchParams.get("history")) {
            if (location.state.answer) {
                showAnswer(location.state.answer);
            }
        } else {
            ask(question);
        }
    }, [searchParams]);

    function ask(q) {
        if (asking) {
            return;
        }
        setAsking(true);
        fetch(`/api/chatgpt/answer?question=${encodeURIComponent(q)}`).then(resp => resp.json()).then(data => {
            setAsking(false);
            if (data.ret === 200) {
                setInputValue("");
                showAnswer(data.answer);
            }
        });
    }

    function showAnswer(answer) {
        const ret = markdown.current.render(answer);
        document.getElementById("code-container").innerHTML = ret;
    }

    return (
        <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>
            <div style={{fontWeight: "bold", fontSize: '1.2em', marginBottom: "10px"}}>
                {question ? `问题：${question}` : ""}
            </div>
            <div id={"code-container"} style={{flex: 1, background: "ghostwhite", border: "2px solid darkgray", marginBottom: "10px"}}>
            </div>
            <div style={{width: '100%', display: "flex"}}>
                <Input placeholder={'输入问题'} value={inputValue} onChange={e => setInputValue(e.target.value)} onPressEnter={() => { setSearchParams({question: encodeURIComponent(inputValue)}); }} />
                <Button type={"primary"} loading={asking} onClick={() => { setSearchParams({question: encodeURIComponent(inputValue)}); }}>
                    发问
                </Button>
            </div>
        </div>
    );
}