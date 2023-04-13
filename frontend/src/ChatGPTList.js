import {useEffect, useState} from "react";
import {Button, List, Space} from "antd";
import {Link} from "react-router-dom";

export default function ChatGPTList() {
    const [data, setData] = useState([]);
    const [refresh, setRefresh] = useState(true);

    useEffect(() => {
        if (!refresh) {
            return;
        }
        fetch(`/api/chatgpt/histories/20`).then(resp => resp.json()).then(data => {
            setRefresh(false);
            if (data.ret === 200) {
                setData(data.data);
            }
        });
    }, [refresh]);

    return (
        <div style={{width: '300px'}}>
            <List dataSource={data} renderItem={item => (
                <List.Item>
                    <Link to={`/chatgpt?question=${encodeURIComponent(item.question)}&history=${item.uuid}`} state={{'answer': item.answer}}>
                        {item.question}
                    </Link>
                </List.Item>
            )} />
            <Space>
                <Button onClick={() => { setRefresh(true); }}>
                    刷新
                </Button>
                <Link to={'/'}>返回首页</Link>
            </Space>
        </div>
    );
}