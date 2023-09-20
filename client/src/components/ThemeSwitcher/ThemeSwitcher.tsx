import { useEffect, useRef } from "react";
import cl from "./ThemeSwitcher.module.scss";

export default function ThemeSwitcher() {
  const checkboxRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const theme = localStorage.getItem("theme");

    if (theme === "dark") {
      checkboxRef.current!.checked = true;
      checkboxRef.current!.click();
    }
  }, []);

  const handleSwitcherClick = () => {
    checkboxRef.current!.checked = !checkboxRef.current!.checked;

    if (checkboxRef.current!.checked) {
      document.body.dataset.theme = "dark";
      localStorage.setItem("theme", "dark");
    } else {
      document.body.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
    // document.body.classList.toggle("darkTheme");
  };
  return (
    <div className={cl.toggleWrapper} onClick={handleSwitcherClick}>
      <input
        type="checkbox"
        className={cl.dn}
        id={cl["dn"]}
        style={{ display: "none" }}
        ref={checkboxRef}
      />
      <label htmlFor={cl.dn} className={cl.toggle}>
        <span className={cl.toggleHandler}>
          <span className={`${cl.crater} ${cl.crater1}`}></span>
          <span className={`${cl.crater} ${cl.crater2}`}></span>
          <span className={`${cl.crater} ${cl.crater3}`}></span>
        </span>
        <span className={`${cl.star} ${cl.star1}`}></span>
        <span className={`${cl.star} ${cl.star2}`}></span>
        <span className={`${cl.star} ${cl.star3}`}></span>
        <span className={`${cl.star} ${cl.star4}`}></span>
        <span className={`${cl.star} ${cl.star5}`}></span>
        <span className={`${cl.star} ${cl.star6}`}></span>
      </label>
    </div>
  );
}
