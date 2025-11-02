import { API_URL } from "./authConstants.js";

/**
 * Solicita un nuevo accessToken usando el refreshToken
 * @param {string} refreshToken
 * @returns {Promise<{accessToken: string|null, refreshToken: string|null} | null>}
 */
export default async function requestNewAccessToken(refreshToken) {
  try {
    const response = await fetch(`${API_URL}/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      console.error("Unable to refresh access token. Status:", response.status);
      return null;
    }

    const json = await response.json();

    if (json.error) {
      console.error("Backend error refreshing token:", json.error);
      return null;
    }

    // Soporte flexible: acepta tanto `json.body` como respuesta plana
    return {
      accessToken: json.body?.accessToken || json.accessToken || null,
      refreshToken: json.body?.refreshToken || json.refreshToken || null,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
}
