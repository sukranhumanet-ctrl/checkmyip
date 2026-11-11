// Vercel Serverless Function: /api/ip
// Mengembalikan IP pengunjung dan header HTTP yang diterima server.
module.exports = function handler(req, res) {
  const h = req.headers;
  const fwd = (h['x-forwarded-for'] || '').split(',')[0].trim();
  const ip = h['x-real-ip'] || fwd || (req.socket && req.socket.remoteAddress) || '';

  const hide = ['cookie', 'authorization', 'x-vercel-oidc-token'];
  const headers = {};
  Object.keys(h).forEach((k) => { if (!hide.includes(k)) headers[k] = h[k]; });

  const dec = (v) => { try { return v ? decodeURIComponent(v) : undefined; } catch (e) { return v; } };

  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({
    ip,
    country: h['x-vercel-ip-country'],
    region: h['x-vercel-ip-country-region'],
    city: dec(h['x-vercel-ip-city']),
    tz: h['x-vercel-ip-timezone'],
    headers,
  });
};
