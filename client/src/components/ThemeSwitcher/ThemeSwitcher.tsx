import cl from "./ThemeSwitcher.module.scss";

export default function ThemeSwitcher() {
  return (
    <div className={cl.themeSwitcher}>
      <input type="checkbox" id={cl["toggle_checkbox"]} />

      <label htmlFor={cl["toggle_checkbox"]}>
        <div id={cl["star"]}>
          <div className={cl.star} id={cl["star-1"]}>
            ★
          </div>
          <div className={cl.star} id={cl["star-2"]}>
            ★
          </div>
        </div>
        <div id={cl["moon"]}></div>
      </label>
    </div>
  );
}
