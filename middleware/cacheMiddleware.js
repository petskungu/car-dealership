const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 minute cache

exports.cacheMiddleware = (duration) => {
  return (req, res, next) => {
    const key = req.originalUrl;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      return res.json(cachedResponse);
    }

    const originalSend = res.json;
    res.json = (body) => {
      cache.set(key, body, duration);
      originalSend.call(res, body);
    };
    next();
  };
};