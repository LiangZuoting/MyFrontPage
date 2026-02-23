import {EllipsisIcon} from "tdesign-icons-react";
import {Button, Dropdown} from "tdesign-react";
import UpdateWebsiteDialog from "./UpdateWebsiteDialog.jsx";
import {useState} from "react";

export default function Website({website, onUpdate, onDelete}) {
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);

    function handleDropdown(item) {
        if (item.value === "update") {
            setShowUpdateDialog(true);
            onUpdate(website);
        } else if (item.value === "delete") {
            onDelete(website);
        }
    }

  return (
    <div>
        <Button>{website.name}</Button>
        <Dropdown onClick={handleDropdown} options={[{content: "更新", value: "update"}, {content: "删除", value: "delete"}]}>
            <Button icon={<EllipsisIcon/>}></Button>
        </Dropdown>
        <UpdateWebsiteDialog visible={showUpdateDialog} website={website} onUpdate={onUpdate}/>
    </div>
  )
}