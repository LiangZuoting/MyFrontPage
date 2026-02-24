import {AddIcon} from "tdesign-icons-react";
import Website from "./Website.jsx";
import {Button} from "tdesign-react";
import UpdateWebsiteDialog from "./UpdateWebsiteDialog.jsx";
import {useState} from "react";

export default function Topmost({websites, onUpdate, onDelete}) {
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);

    function handleShowUpdateDialog() {
        setShowUpdateDialog(true);
    }

    return (
        <div>
            <h2>常用网址</h2>
            <div style={{display: "flex"}}>
                <Button icon={<AddIcon/>} onClick={handleShowUpdateDialog}>添加</Button>
                {
                    websites.map(website => (
                        <Website website={website} key={website.id} onUpdate={onUpdate} onDelete={onDelete} />
                    ))
                }
            </div>
            <UpdateWebsiteDialog visible={showUpdateDialog} onUpdate={onUpdate}/>
        </div>
    )
}