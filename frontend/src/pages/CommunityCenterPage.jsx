import Footer from '../components/Footer';
import NewsCard from '../components/home/NewsCard';
import useNewsData from '../hooks/useNewsData';


const CommunityPage = () => {
    const { news, loading } = useNewsData(10);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center text-black font-bold text-xl">
          Loading community news...
        </div>
      );
    }

    return (
        <div>
            <div className="min-h-screen py-12 px-4 sm:px-10 mb-20">
                <div className="mt-30 text-center mb-10">
                    <h1 className="text-4xl font-bold text-shadow-black text-shadow-xs text-yellow-300 mb-3">Community Centre</h1>
                    <p className="text-black text-lg max-w-xl mx-auto">
                      Stay updated with the latest logistics and transport-related news from around the world.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {news.map((article, index) => (
                        <NewsCard key={index} { ...article } />
                    ))}
                </div>

            </div>
            <div>
                <Footer />
            </div>
        </div>
    );
};

export default CommunityPage;