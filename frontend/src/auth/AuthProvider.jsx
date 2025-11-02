import { useContext, createContext, useState, useEffect } from "react";
import requestNewAccessToken from "./requestNewAccessToken";
import { API_URL } from "./authConstants";

const AuthContext = createContext({
  isAuthenticated: false,
  getAccessToken: () => {},
  setAccessTokenAndRefreshToken: () => {},
  getRefreshToken: () => {},
  saveUser: () => {},
  getUser: () => {},
  signout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  function getAccessToken() {
    return accessToken;
  }

  function saveUser(userData) {
    // Soporte flexible para el formato del backend
    const at = userData.body?.accessToken || userData.accessToken;
    const rt = userData.body?.refreshToken || userData.refreshToken;
    const u = userData.body?.user || userData.user;

    setAccessTokenAndRefreshToken(at, rt);
    setUser(u);
    setIsAuthenticated(true);
  }

  function setAccessTokenAndRefreshToken(at, rt) {
    setAccessToken(at);
    setRefreshToken(rt);

    // guardamos ambos tokens en localStorage
    localStorage.setItem(
      "token",
      JSON.stringify({ accessToken: at, refreshToken: rt })
    );
  }

  function getRefreshToken() {
    if (refreshToken) return refreshToken;

    const token = localStorage.getItem("token");
    if (token) {
      const { refreshToken } = JSON.parse(token);
      setRefreshToken(refreshToken);
      return refreshToken;
    }
    return null;
  }

  async function getNewAccessToken(rt) {
    try {
      const response = await requestNewAccessToken(rt);
      if (response?.accessToken) {
        setAccessToken(response.accessToken);
        setRefreshToken(response.refreshToken);

        // actualizar localStorage
        localStorage.setItem(
          "token",
          JSON.stringify({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          })
        );

        const userInfo = await retrieveUserInfo(response.accessToken);
        setUser(userInfo);
        setIsAuthenticated(true);
        return response.accessToken;
      }
    } catch (error) {
      console.error("Error al renovar accessToken:", error);
    }
    return null;
  }

  function getUser() {
    return user;
  }

  function signout() {
    localStorage.removeItem("token");
    setAccessToken("");
    setRefreshToken("");
    setUser(null);
    setIsAuthenticated(false);
  }

  async function checkAuth() {
    try {
      if (accessToken) {
        const userInfo = await retrieveUserInfo(accessToken);
        if (userInfo) {
          setUser(userInfo);
          setIsAuthenticated(true);
          return;
        }
      } else {
        const tokenData = localStorage.getItem("token");
        if (tokenData) {
          const { refreshToken, accessToken } = JSON.parse(tokenData);

          if (accessToken) {
            const userInfo = await retrieveUserInfo(accessToken);
            if (userInfo) {
              setUser(userInfo);
              setIsAuthenticated(true);
              setAccessToken(accessToken);
              setRefreshToken(refreshToken);
              return;
            }
          }

          const newToken = await getNewAccessToken(refreshToken);
          if (!newToken) setIsAuthenticated(false);
        } else {
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error("Error checkAuth:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        getAccessToken,
        setAccessTokenAndRefreshToken,
        getRefreshToken,
        saveUser,
        getUser,
        signout,
      }}
    >
      {isLoading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
}

async function retrieveUserInfo(accessToken) {
  try {
    const response = await fetch(`${API_URL}/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const json = await response.json();
      return json.body?.user || json.user; // soporte flexible
    } else if (response.status === 403) {
      console.error("Acceso denegado: token inválido o expirado");
    }
  } catch (error) {
    console.error("Error retrieveUserInfo:", error);
  }
  return null;
}

export const useAuth = () => useContext(AuthContext);
