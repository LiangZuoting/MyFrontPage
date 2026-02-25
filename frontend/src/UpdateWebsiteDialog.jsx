import {Button, Checkbox, Dialog, Form, Input, Select, Space} from "tdesign-react";
import {useEffect, useState} from "react";

const {FormItem} = Form;

export default function UpdateWebsiteDialog({visible, website, onUpdate}) {
    const [_visible, setVisible] = useState(visible);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        setVisible(visible);
    }, [visible]);

    useEffect(() => {
        fetch("/api/websites/categories").then(res => res.json()).then(data => {
            const c = []
            data.categories.forEach(item => {
                c.push({label: item, value: item});
            });
            setCategories(c);
        });
    }, []);

    function cancel() {
        setVisible(false);
    }

    function handleSubmit(e) {
        fetch("/api/websites", {
            method: website ? "PUT" : "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(website ? {id: website.id, ...e.fields} : e.fields),
        }).then(res => res.json()).then(() => {
            onUpdate();
            setVisible(false);
        });
    }

    return (
        <Dialog visible={_visible} header={website ? "更新网址" : "添加网址"} cancelBtn={null} confirmBtn={null} onEscKeydown={cancel} onCloseBtnClick={cancel} onOverlayClick={cancel}>
            <Form onSubmit={handleSubmit}>
                <FormItem label="名称" name={"name"} initialData={website?.name}>
                    <Input maxlength={64}/>
                </FormItem>
                <FormItem label="网址" name={"url"} initialData={website?.url}>
                    <Input maxlength={2048}/>
                </FormItem>
                <FormItem label={"分类"} name={"category"} initialData={website?.category}>
                    <Select options={categories} filterable creatable />
                </FormItem>
                <FormItem label={"常用"} name={"topmost"} initialData={website?.topmost}>
                    <Checkbox />
                </FormItem>
                <FormItem label={" "}>
                    <Space>
                        <Button type={"submit"}>确定</Button>
                        <Button onClick={cancel}>取消</Button>
                    </Space>
                </FormItem>
            </Form>
        </Dialog>
    )
}