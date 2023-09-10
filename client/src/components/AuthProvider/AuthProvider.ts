import { useEffect } from "react";
import { DecodedJwt, IAuthProviderParams } from "../../interfaces/interfaces";
import { useLocation, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { SERVER_URL } from "../../config/config";

export default function AuthProvider({ children }: IAuthProviderParams) {
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("token dose not exist");

          return navigate("/log-in");
        }
        const decodedJwt: DecodedJwt = jwtDecode(token);
        const exp = decodedJwt.exp * 1000;
        const currentDate = Date.now();

        if (currentDate >= exp) {
          console.log("token is expired");

          const response = await fetch(`${SERVER_URL}/get-new-jwt`, {
            headers: {
              Authorization: token,
            },
          });
          const result = await response.json();
          console.log("new token", result.token);

          localStorage.setItem("token", result.token as string);
          // return navigate("/log-in");
          return;
        }
      } catch (err) {
        console.log("auth err", err);
      }
    };
    check();
  });

  return children;
}
