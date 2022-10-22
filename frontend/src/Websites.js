import {useEffect, useState} from "react";
import {AutoComplete, Button, Dropdown, Form, Input, Menu, Modal, Switch} from "antd";

const ModalMode = {
  Add: 0,
  Update: 1
};

function WebsiteButton(props) {

    function handleClick() {
        window.open(props.website.url, "_blank");
    }

    return (
        <Dropdown.Button
            data-uuid={props.website.uuid}
            onClick={handleClick}
            overlay={<Menu onClick={props.onMenuClick}
                           data-uuid={props.website.uuid}
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
            {props.website.name}
        </Dropdown.Button>
    );
}

function TopMost() {
    const [data, setData] = useState(null);
    const [tags, setTags] = useState([]);
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

    function handleAdd() {
        form.setFieldsValue({name: "", url: "", tag: "", topmost: false});
        setModalMode(ModalMode.Add);
        setModalVisible(true);
    }

    function handleOk() {
        form.validateFields().then(values => {
            if (!tags.find(item => item.value === values.tag)) {
                setTags([...tags, {label: values.tag, value: values.tag}]);
            }
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
        fetch("/api/websitesnavigation/tags").then(rsp => rsp.json()).then(data => {
            if (data.ret === 0) {
                setTags(data.data.map(tag => ({label: tag.tag, value: tag.tag})));
            }
        });
    }, []);

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
            <div>
                <Button onClick={handleAdd}>添加</Button>
                {
                    data.data.map(item => <WebsiteButton key={item.uuid} website={item} onMenuClick={handleMenuClick}/>)
                }
            </div>
            {
                tags.map(tag => (
                    <div key={tag} style={{marginTop: "20px"}}>
                        <h3 style={{display: "inline-block", width: "100px"}}>{tag.value}</h3>
                        {
                            data.data.filter(item => item.tag === tag.value).map(item => (
                                <WebsiteButton key={item.uuid} website={item} onMenuClick={handleMenuClick}/>
                            ))
                        }
                    </div>
                ))
            }
            <Modal destroyOnClose={true} title={modalMode === ModalMode.Add ? "添加网址" : "更新网址"} open={modalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form preserve={false} form={form} labelCol={{span: 4}} wrapperCol={{span: 20}}>
                    <Form.Item preserve={false} name={"name"} label={"网站名称"} rules={[{required: true}]}>
                        <Input />
                    </Form.Item>
                    <Form.Item preserve={false} name={"url"} label={"网址"} rules={[{required: true}]}>
                        <Input />
                    </Form.Item>
                    <Form.Item preserve={false} name={"tag"} label={"分类"} rules={[{required: false}]}>
                        <AutoComplete options={tags}>
                            <Input/>
                        </AutoComplete>
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
        <div style={{margin: "50px 200px 0 200px"}}>
            <h2>网址导航</h2>
            <TopMost />
        </div>
    );
}