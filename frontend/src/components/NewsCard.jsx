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
                    className="w-full h-48 object-cover"
                />
            )}
          <div className="p-4">
                <h3 className="text-lg font-bold text-[#192a67] mb-2">{title}</h3>
                <p className="text-gray-600 text-sm mb-2">
                    {description?.substring(0, 100)}...
                </p>
                <p className="text-xs text-gray-400">{new Date(pubDate).toLocaleString()}</p>
          </div>
        </a>
  );
};

export default NewsCard;
