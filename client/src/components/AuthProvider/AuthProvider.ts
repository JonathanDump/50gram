import { useEffect } from "react";
import { DecodedJwt, IAuthProviderParams } from "../../interfaces/interfaces";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

export default function AuthProvider({ children }: IAuthProviderParams) {
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("token dose not exist");

        return navigate("/log-in");
      }
      const decodedJwt: DecodedJwt = jwtDecode(token);
      const exp = decodedJwt.exp * 1000;
      console.log("exp", new Date(exp));

      const currentDate = Date.now();
      console.log("current date", currentDate);
      if (currentDate >= exp) {
        console.log("token is expired");

        localStorage.removeItem("token");
        return navigate("/log-in");
      }
    };
    check();
  }, []);

  return children;
}
