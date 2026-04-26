
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

export const ADMIN_LOGIN_URL = `${API_BASE_URL}/api/auth/login`;
export const SKILLS_URL = `${API_BASE_URL}/api/skills`;
export const PORTFOLIOS_URL = `${API_BASE_URL}/api/portfolios`;
export const MESSAGES_URL = `${API_BASE_URL}/api/messages`;

export const backendAssetUrl = (assetPath) => {
  if (!assetPath) {
    return "";
  }

  if (/^https?:\/\//i.test(assetPath)) {
    return assetPath;
  }

  return `${API_BASE_URL}${assetPath}`;
};
