import {useEffect, useState} from "react";
import {Button, List, Space} from "antd";
import {Link} from "react-router-dom";

export default function ChatGPTHistories() {
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
        <div style={{width: '300px', height: "100%"}}>
            <List style={{height: "calc(100% - 32px)"}} dataSource={data} renderItem={item => (
                <List.Item>
                    <Link to={`/chatgpt?session=${item.uuid}`}>
                        {item.title}
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