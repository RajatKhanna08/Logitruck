import axios from 'axios';
import React, { useEffect, useState } from 'react'

const useNewsData = (size) => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    const newsAxios = axios.create({
        withCredentials: false
    });

    useEffect(() => {
        const fetchNews = async () => {
            try{
                const response = await newsAxios.get("https://newsdata.io/api/1/news", {
                    params: {
                        apikey: import.meta.env.VITE_NEWS_API_KEY,
                        q: "logistics OR trucking OR roadblock OR weather",
                        country: "in",
                        language: "en",
                        category: "business",
                        size: size
                    }
                });
                setNews(response.data.results || []);
            }
            catch(err){
                console.log("Error fetching news: ", err.message);
            }
            finally{
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    return { news, loading };
}

export default useNewsData
