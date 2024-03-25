import {Button, Input, List} from "antd";
import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";

function ChatGPTQA({question, answer}) {
    // 上下两栏，上栏显示问题，下栏显示回答
    // 问题和回答都是 Markdown 格式的文本，需要使用 markdown-it 渲染
    // 问题和回答都是只读的，不需要使用 antd 的 Input 组件
    return (
        <div style={{flex: 1, height: "100%", padding: "0 20px", overflow: "auto"}}>
            <div style={{marginBottom: "20px"}}>
                <div style={{marginBottom: "10px", fontSize: "16px"}}>问题</div>
                <div dangerouslySetInnerHTML={{__html: markdown.current.render(question)}} />
            </div>
            <div>
                <div style={{marginBottom: "10px", fontSize: "16px"}}>回答</div>
                <div dangerouslySetInnerHTML={{__html: markdown.current.render(answer)}} />
            </div>
        </div>
    );
}

export default function ChatGPTSession() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [sessionID, setSessionID] = useState(searchParams.get("session") || "");
    const [qaList, setQAList] = useState([]);
    const question = searchParams.get('question');
    const [inputValue, setInputValue] = useState("");
    const [asking, setAsking] = useState(false);

    useEffect(() => {
        if (sessionID) {
            fetch(`/api/chatgpt/sessions/${sessionID}`).then(resp => resp.json()).then(data => {
                if (data.ret === 200) {
                    setQAList(data.data);
                }
            });
        } else if (question) {
            ask(question);
        }
    }, []);

    function handleSend() {
        ask(inputValue);
    }

    function ask(question) {
        if (asking || !question) {
            return;
        }
        setAsking(true);
        fetch(`/api/chatgpt/answer?question=${encodeURIComponent(question)}&session=${sessionID}`).then(resp => resp.json()).then(data => {
            setAsking(false);
            if (data.ret === 200) {
                setInputValue("");
                setSessionID(data.session);
                setSearchParams({session: data.session});
                setQAList([...qaList, {question, answer: data.answer}]);
            }
        });
    }

    return (
        <div style={{height: "100%", maxHeight: "100%"}}>
            <List style={{height: "calc(100% - 32px)"}} dataSource={qaList} renderItem={item => <ChatGPTQA question={item.question} answer={item.answer} />} />
            <div style={{display: "flex", padding: "10px"}}>
                <Input placeholder={"输入问题"} OnChange={e => setInputValue(e.target.value)} value={inputValue} />
                <Button onClick={handleSend} disabled={!inputValue || asking}>发送</Button>
            </div>
        </div>
    );
}