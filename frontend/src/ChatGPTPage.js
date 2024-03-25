import ChatGPTHistories from "./ChatGPTHistories";
import ChatGPTQA from "./ChatGPTQA";
import ChatGPTSession from "./ChatGPTSession";

export default function ChatGPTPage() {
return (
    <div style={{display: "flex", width: '100%', height: '100%', padding: "20px"}}>
        <ChatGPTHistories />
        <ChatGPTSession />
    </div>
);
}