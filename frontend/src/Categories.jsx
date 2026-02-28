import Website from "./Website.jsx";

function Category({category, websites, onUpdate, onDelete}) {
  return (
    <div>
      <h3>{category}</h3>
      <div style={{display: "flex"}}>
        {
            websites.map(website => (
                <Website website={website} onUpdate={onUpdate} onDelete={onDelete} />
            ))
        }
      </div>
    </div>
  );
}

export default function Categories({websites, onUpdate, onDelete}) {
  return (
    <div>
        <h2>分类网址</h2>
        {
            Object.keys(websites).map(category => (
                <Category category={category} websites={websites[category]} onUpdate={onUpdate} onDelete={onDelete} />
            ))
        }
    </div>
  );
}