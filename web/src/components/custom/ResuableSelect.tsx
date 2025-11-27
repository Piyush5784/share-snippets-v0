import {
  monacoLanguages,
  monacoLanguagesForReactSelect,
} from "@/lib/languageSupported";
import Select from "react-select";

const LanguageSelect = ({
  value,
  onChange,
  theme = "light",
}: {
  value: string;
  onChange: (val: string) => void;
  theme?: "light" | "dark";
}) => {
  const colors = {
    light: {
      background: "#ffffff",
      text: "#000000",
      border: "#cccccc",
      hoverBorder: "#888888",
      selectedBg: "#e0e0e0",

      focusBorder: "#000000",
    },
    dark: {
      background: "#000000",
      text: "#ffffff",
      border: "#555555",
      hoverBorder: "#aaaaaa",
      selectedBg: "#222222",
      focusBorder: "#ffffff",
    },
  };

  const currentTheme = colors[theme ? "light" : "dark"];

  if (!currentTheme) return;

  return (
    <div style={{ display: "flex", alignItems: "center", height: 36 }}>
      <Select
        classNamePrefix="shadcn"
        value={monacoLanguagesForReactSelect.find((opt) => opt.value === value)}
        onChange={(option) => onChange(option?.value || "")}
        options={monacoLanguagesForReactSelect}
        isSearchable
        styles={{
          control: (base, state) => ({
            ...base,
            width: 140,
            height: 15,
            borderRadius: 6,
            backgroundColor: currentTheme.background,
            borderColor: state.isFocused
              ? currentTheme.focusBorder
              : currentTheme.border,
            boxShadow: "none", // remove blue glow
            "&:hover": { borderColor: currentTheme.hoverBorder },
          }),
          menu: (base) => ({
            ...base,
            width: 140,
            borderRadius: 6,
            backgroundColor: currentTheme.background,
            borderColor: currentTheme.border,
            boxShadow: "none",
            padding: 0,
            zIndex: 20,
            marginTop: 2,
          }),
          valueContainer: (base) => ({
            ...base,
            fontSize: 14,
            color: currentTheme.text,
          }),
          option: (base, state) => ({
            ...base,
            fontSize: 14,
            borderRadius: 6,
            backgroundColor: state.isSelected
              ? currentTheme.selectedBg
              : state.isFocused
              ? currentTheme.selectedBg
              : currentTheme.background,
            color: currentTheme.text,
            display: "flex",
            alignItems: "center",
            padding: "8px 12px",
          }),
          singleValue: (base) => ({
            ...base,
            fontSize: 14,
            color: currentTheme.text,
            display: "flex",
            alignItems: "center",
          }),
          menuList: (base) => ({
            ...base,
            padding: 0,
            borderRadius: 6,
          }),
          input: (base) => ({
            ...base,
            color: currentTheme.text,
          }),
        }}
        theme={(themeObj) => ({
          ...themeObj,
          borderRadius: 6,
          colors: {
            ...themeObj.colors,
            // Remove all blue tones
            primary50: currentTheme.selectedBg,
            primary: currentTheme.focusBorder,
            neutral0: currentTheme.background,
            neutral80: currentTheme.text,
          },
        })}
        placeholder="Language"
      />
    </div>
  );
};

export default LanguageSelect;
