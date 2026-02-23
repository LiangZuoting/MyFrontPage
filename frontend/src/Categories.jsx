import Website from "./Website.jsx";

function Category({category, websites, onUpdate, onDelete}) {
  return (
    <div>
      <h2>{category}</h2>
        {
            websites.map(website => (
                <Website website={website} onUpdate={onUpdate} onDelete={onDelete} />
            ))
        }
    </div>
  );
}

export default function Categories({websites, onUpdate, onDelete}) {
  return (
    <div>
        {
            Object.keys(websites).map(category => (
                <Category category={category} websites={websites[category]} onUpdate={onUpdate} onDelete={onDelete} />
            ))
        }
    </div>
  );
}