import { useSelector, useDispatch } from "react-redux";
import { setTheme } from "../theme/themeSlice";

export default function ThemeToggle() {
  const theme = useSelector((state) => state.theme.value);
  const dispatch = useDispatch();

  const themes = ["forest", "dark", "light"];

  return (
    <select
      className="select select-bordered w-full max-w-xs"
      value={theme}
      onChange={(e) => dispatch(setTheme(e.target.value))}
    >
      {themes.map((t) => (
        <option key={t} value={t}>
          {t.charAt(0).toUpperCase() + t.slice(1)}
        </option>
      ))}
    </select>
  );
}
