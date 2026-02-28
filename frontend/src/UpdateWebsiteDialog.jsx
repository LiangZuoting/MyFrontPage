import {Button, Checkbox, Dialog, Form, Input, Select, Space} from "tdesign-react";
import {useContext, useEffect, useState} from "react";
import {CategoriesContext} from "./global.jsx";

const {FormItem} = Form;

export default function UpdateWebsiteDialog({visible, website, onUpdated, onCancel}) {

    function handleSubmit(e) {
        fetch("/api/websites", {
            method: website ? "PUT" : "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(website ? {id: website.id, ...e.fields} : e.fields),
        }).then(res => res.json()).then(() => {
            onUpdated();
        });
    }

    const categories = useContext(CategoriesContext);

    return (
        <Dialog visible={visible} header={website ? "更新网址" : "添加网址"} cancelBtn={null} confirmBtn={null} onEscKeydown={onCancel} onCloseBtnClick={onCancel} onOverlayClick={onCancel} destroyOnClose={true}>
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
                        <Button onClick={onCancel}>取消</Button>
                    </Space>
                </FormItem>
            </Form>
        </Dialog>
    )
}