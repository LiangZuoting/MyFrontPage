import {EllipsisIcon} from "tdesign-icons-react";
import {Button, Dropdown} from "tdesign-react";
import UpdateWebsiteDialog from "./UpdateWebsiteDialog.jsx";
import {useState} from "react";

export default function Website({website, onUpdate, onDelete}) {

    function handleDropdown(item) {
        if (item.value === "update") {
            onUpdate(website);
        } else if (item.value === "delete") {
            onDelete(website);
        }
    }

    function openWebsite() {
        window.open(website.url, "_blank");
    }

  return (
    <div className={"website"}>
        <Button theme={"default"} onClick={openWebsite}>{website.name}</Button>
        <Dropdown onClick={handleDropdown} options={[{content: "更新", value: "update"}, {content: "删除", value: "delete"}]}>
            <Button theme={"default"} variant={"dashed"} icon={<EllipsisIcon/>}></Button>
        </Dropdown>
    </div>
  )
}