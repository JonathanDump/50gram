import jwtDecode from "jwt-decode";
import { DecodedJwt } from "../interfaces/interfaces";

export default function userFromJwt() {
  const token = localStorage.getItem("token");
  if (token) {
    const decodedJwt = jwtDecode(token) as DecodedJwt;
    return decodedJwt.user;
  }
  return null;
}
