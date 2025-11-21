const config = require('../../../config/config');

const API_BASE_URL = 'https://www.behance.net/v2';
const BEHANCE_CLIENT_ID = process.env.BEHANCE_CLIENT_ID || (config.behance && config.behance.clientId) || '';
const DEFAULT_USER = (config.behance && config.behance.defaultUser) || '';

export default async function handler(req, res) {
  const user = (req.query.user || DEFAULT_USER || '').trim();

  if (!user) {
    return res.status(400).json({ http_code: 400, error: 'Query parameter "user" is required.' });
  }

  if (!BEHANCE_CLIENT_ID) {
    return res.status(500).json({ http_code: 500, error: 'Behance client ID not provided.' });
  }

  try {
    const safeUser = encodeURIComponent(user);
    const profileEndpoint = `${API_BASE_URL}/users/${safeUser}?api_key=${BEHANCE_CLIENT_ID}`;
    const projectsEndpoint = `${API_BASE_URL}/users/${safeUser}/projects?api_key=${BEHANCE_CLIENT_ID}`;

    const [profileResponse, projectsResponse] = await Promise.all([fetch(profileEndpoint), fetch(projectsEndpoint)]);

    if (!profileResponse.ok) {
      const body = await profileResponse.json().catch(() => ({}));
      return res.status(profileResponse.status).json(Object.assign({ http_code: profileResponse.status }, body));
    }

    if (!projectsResponse.ok) {
      const body = await projectsResponse.json().catch(() => ({}));
      return res.status(projectsResponse.status).json(Object.assign({ http_code: projectsResponse.status }, body));
    }

    const [profile, projects] = await Promise.all([profileResponse.json(), projectsResponse.json()]);

    return res.status(200).json(Object.assign({ http_code: 200 }, profile, projects));
  } catch (error) {
    console.error('Behance proxy error:', error);
    return res.status(502).json({ http_code: 502, error: 'There was a problem reaching the Behance API.' });
  }
}
