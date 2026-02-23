import Topmost from "./Topmost.jsx";
import {useEffect, useState} from "react";
import Categories from "./Categories.jsx";

export default function Websites() {
    const [websites, setWebsites] = useState({"topmost": [], "categories": {}});

        function fetchWebsites() {
        fetch("/api/websites")
            .then(res => res.json())
            .then(data => {
                setWebsites(data);
            });
    }

    useEffect(() => {
        fetchWebsites();
    }, []);

    function handleUpdate() {
        fetchWebsites();
    }

    function handleDelete() {
        fetchWebsites();
    }

    return (
        <div>
            <Topmost websites={websites.topmost} onUpdate={handleUpdate} onDelete={handleDelete}/>
            <Categories websites={websites.categories} onUpdate={handleUpdate} onDelete={handleDelete}/>
        </div>
    )
}