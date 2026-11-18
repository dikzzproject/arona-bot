import axios from 'axios';

export default async function searchPinterest(query) {
    try {
        const response = await axios.get(`https://api.siputzx.my.id/api/s/pinterest?query=${encodeURIComponent(query)}`);
        
        const results = response.data?.data;
        if (!results || !Array.isArray(results) || results.length === 0) return null;

        const imageUrls = results
            .map(item => item.image_url)
            .filter(url => url && typeof url === 'string');
        return imageUrls;
    } catch (error) {
        console.error("Gagal mengambil gambar Pinterest:", error.message);
        return null;
    }
}