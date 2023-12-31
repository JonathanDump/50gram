import { useEffect, useState } from "react";
import { DecodedJwt, IAuthProviderParams } from "../../interfaces/interfaces";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { SERVER_URL } from "../../config/config";

export default function AuthProvider({ children }: IAuthProviderParams) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          return navigate("/log-in");
        }

        const decodedJwt: DecodedJwt = jwtDecode(token);
        const exp = decodedJwt.exp * 1000;
        const currentDate = Date.now();

        if (currentDate >= exp) {
          const response = await fetch(`${SERVER_URL}/get-new-jwt`, {
            headers: {
              Authorization: token,
            },
          });
          const result = await response.json();

          localStorage.setItem("token", result.token as string);
          setLoading(false);

          return;
        }
        setLoading(false);
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/log-in");
      }
    };
    check();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return children;
}
