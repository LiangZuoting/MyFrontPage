import {useEffect, useState} from "react";
import {Button, Dropdown, Form, Input, Menu, Modal, Switch} from "antd";

const ModalMode = {
  Add: 0,
  Update: 1
};

function TopMost() {
    const [data, setData] = useState(null);
    const [needUpdate, setNeedUpdate] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState(ModalMode.Add);
    const [editingWebsite, setEditingWebsite] = useState(null);
    const [form] = Form.useForm();

    function handleMenuClick(e) {
        const uuid = e.domEvent.currentTarget.parentNode.dataset.uuid;
        if (e.key === "delete") {
            fetch(`/api/websitesnavigation/${uuid}`, {method: "DELETE"}).then(response => response.json()).then(data => {
                setNeedUpdate(true);
            });
        } else if (e.key === "update") {
            const website = data.data.find(item => item.uuid === uuid);
            setEditingWebsite(website);
            form.setFieldsValue({...website}); // Form initialValues doesn't work
            setModalMode(ModalMode.Update);
            setModalVisible(true);
        }
    }

    function handleClick(e) {
        const website = data.data.find(item => item.uuid === e.currentTarget.parentNode.dataset.uuid);
        window.open(website.url, "_blank");
    }

    function handleAdd() {
        form.setFieldsValue({name: "", url: "", tag: "", topmost: false});
        setModalMode(ModalMode.Add);
        setModalVisible(true);
    }

    function handleOk() {
        form.validateFields().then(values => {
            fetch(modalMode === ModalMode.Add ? '/api/websitesnavigation' : `/api/websitesnavigation/${editingWebsite.uuid}`, {
                headers: {
                    "Content-Type": "application/json"
                },
                method: modalMode === ModalMode.Add ? "POST" : "PUT",
                body: JSON.stringify(values)
            }).then(response => response.json()).then(data => {
                setModalVisible(false);
                setNeedUpdate(values.topmost);
            });
        });
    }

    function handleCancel() {
        setModalVisible(false);
    }

    useEffect(() => {
        if (!needUpdate) {
            return;
        }
        setNeedUpdate(false);
        fetch('/api/websitesnavigation').then(response => response.json()).then(data => {
            setData(data);
        });
    }, [needUpdate]);

    if (!data) {
        return <div></div>;
    }

    return (
        <>
            <div style={{margin: "50px 200px 0 200px", textAlign: "left"}}>
                <Button onClick={handleAdd}>添加</Button>
                {
                    data.data.map((item, index) => <Dropdown.Button
                        key={`${item.uuid}-${index}`}
                        data-uuid={item.uuid}
                        onClick={handleClick}
                        overlay={<Menu onClick={handleMenuClick}
                           data-uuid={item.uuid}
                           items={[
                               {
                                   key: "delete",
                                   label: "删除"
                               },
                               {
                                   key: "update",
                                   label: "修改"
                               }
                           ]}/>}>
                        {item.name}
                    </Dropdown.Button>)
                }
            </div>
            <Modal destroyOnClose={true} title={modalMode === ModalMode.Add ? "添加网址" : "更新网址"} open={modalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form preserve={false} form={form} labelCol={{span: 4}} wrapperCol={{span: 20}}>
                    <Form.Item preserve={false} name={"name"} label={"网站名称"} rules={[{required: true}]}>
                        <Input />
                    </Form.Item>
                    <Form.Item preserve={false} name={"url"} label={"网址"} rules={[{required: true}]}>
                        <Input />
                    </Form.Item>
                    <Form.Item preserve={false} name={"tag"} label={"分类"} rules={[{required: false}]}>
                        <Input />
                    </Form.Item>
                    <Form.Item preserve={false} name={"topmost"} label={"常用"} valuePropName={"checked"}>
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default function Websites() {
    return (
        <div>
            <TopMost />
        </div>
    );
}