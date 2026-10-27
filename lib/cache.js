const cache = new Map();
const setCache = (key, value, ttl = 60000) => {
  cache.set(key, value);
  setTimeout(() => cache.delete(key), ttl);
}

export default cache;
export {setCache};