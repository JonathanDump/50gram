import { GoogleButtonProps } from "../../interfaces/interfaces";
import cl from "./GoogleButton.module.scss";
import { useNavigate } from "react-router-dom";

export default function GoogleButton({ title }: GoogleButtonProps) {
  const navigate = useNavigate();
  const handleClick = async () => {
    try {
      const URL = import.meta.env.VITE_API_ENDPOINT;

      const response = await fetch(`${URL}/log-in/google`);
      if (!response.ok) {
        throw new Error("Can't log in");
      }

      navigate("/50gram");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className={cl.googleButtonWrapper}>
      <button type="button" onClick={handleClick}>
        {title} with Google
      </button>
    </div>
  );
}
