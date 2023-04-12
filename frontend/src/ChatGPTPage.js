import ChatGPTList from "./ChatGPTList";
import ChatGPTQA from "./ChatGPTQA";

export default function ChatGPTPage() {
return (
    <div style={{display: "flex", width: '100%', height: '100%', padding: "20px"}}>
        <ChatGPTList />
        <ChatGPTQA />
    </div>
);
}