import axios from 'axios';

const tiktokdownloader = async (url) => {
  try {
    const { data: res } = await axios.get('https://tikwm.com/api/', { params: { url } });
    return {
      data: res.data
    };
  } catch (e) {
    console.log(e);
    return {};
  }
}

export default tiktokdownloader;