import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { DecodedJwt } from "../../interfaces/interfaces";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function GoogleButton() {
  const navigate = useNavigate();
  return (
    <GoogleOAuthProvider clientId="785080223845-4r2ughnfu2lbdgfns0i0g2gpkqoicjnn.apps.googleusercontent.com">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          const URL = import.meta.env.VITE_API_ENDPOINT;
          const decoded: DecodedJwt = jwtDecode(credentialResponse.credential!);
          const { name, email, picture } = decoded;
          const body = {
            name,
            email,
            img: picture,
          };
          const response = await fetch(`${URL}/sign-up/google`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });
          const result = await response.json();

          localStorage.setItem("token", result.token);
          // localStorage.setItem("myInfo", result.myInfo);

          result.isSuccess ? navigate("/") : new Error("Sign up failed");
          console.log(decoded);

          console.log(credentialResponse);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </GoogleOAuthProvider>
  );
}
