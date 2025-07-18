const NewsCard = ({ title, description, image_url, link, pubDate }) => {
    return (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white shadow-md rounded-lg h-95 overflow-hidden hover:shadow-yellow-300 transition-all duration-300 max-w-sm"
        >
            {image_url && (
                <img
                    src={image_url}
                    alt={title}
                    className="w-full min-h-48 max-h-48 object-cover"
                />
            )}
          <div className="p-4">
                <h3 className="text-lg min-h-4 max-h-14 overflow-clip font-bold text-[#192a67] mb-2">{title}</h3>
                <p className="text-gray-600 min-h-19 h-10 overflow-clip text-sm">
                    {description?.substring(0, 100)}...
                </p>
                <p className="text-xs min-h-5 text-gray-400">{new Date(pubDate).toLocaleString()}</p>
          </div>
        </a>
  );
};

export default NewsCard;
