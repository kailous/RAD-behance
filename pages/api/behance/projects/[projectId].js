const config = require('../../../../config/config');

const API_BASE_URL = 'https://www.behance.net/v2';
const BEHANCE_CLIENT_ID = process.env.BEHANCE_CLIENT_ID || (config.behance && config.behance.clientId) || '';

export default async function handler(req, res) {
  const projectId = (req.query.projectId || '').trim();

  if (!projectId) {
    return res.status(400).json({ http_code: 400, error: 'Project ID is required.' });
  }

  if (!BEHANCE_CLIENT_ID) {
    return res.status(500).json({ http_code: 500, error: 'Behance client ID not provided.' });
  }

  try {
    const safeId = encodeURIComponent(projectId);
    const endpoint = `${API_BASE_URL}/projects/${safeId}?api_key=${BEHANCE_CLIENT_ID}`;
    const response = await fetch(endpoint);
    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res.status(response.status).json(Object.assign({ http_code: response.status }, body));
    }

    return res.status(200).json(Object.assign({ http_code: 200 }, body));
  } catch (error) {
    console.error('Behance project fetch error:', error);
    return res.status(502).json({ http_code: 502, error: 'There was a problem reaching the Behance API.' });
  }
}
