import Topmost from "./Topmost.jsx";
import {useEffect, useState} from "react";
import Categories from "./Categories.jsx";
import {CategoriesContext} from "./global.jsx";
import UpdateWebsiteDialog from "./UpdateWebsiteDialog.jsx";

export default function Websites() {
    const [websites, setWebsites] = useState({"topmost": [], "categories": {}});
    const [categories, setCategories] = useState([]);
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);
    const [website, setWebsite] = useState(null);

    function fetchWebsites() {
        const nsfw = localStorage.getItem("NSFW") || "0";
        fetch(`/api/websites?nsfw=${nsfw}`)
            .then(res => res.json())
            .then(data => {
                setWebsites(data);
            });

        fetch("/api/websites/categories").then(res => res.json()).then(data => {
            const c = [];
            data.categories.forEach(item => {
                c.push({label: item, value: item});
            });
            setCategories(c);
        });
    }

    useEffect(() => {
        fetchWebsites();
    }, []);

    function handleUpdated(website) {
        setShowUpdateDialog(false);
        fetchWebsites();
    }

    function handleUpdate(website) {
        setWebsite(website);
        setShowUpdateDialog(true);
    }

    function handleDelete(website) {
        fetchWebsites();
    }

    return (
        <CategoriesContext value={categories}>
            <div>
                <Topmost websites={websites.topmost} onUpdate={handleUpdate} onDelete={handleDelete}/>
                <Categories websites={websites.categories} onUpdate={handleUpdate} onDelete={handleDelete}/>
                <UpdateWebsiteDialog visible={showUpdateDialog} website={website} onUpdated={handleUpdated} onCancel={() => {setShowUpdateDialog(false);}}/>
            </div>
        </CategoriesContext>
    )
}