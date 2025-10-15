import {
  monacoLanguages,
  monacoLanguagesForReactSelect,
} from "@/lib/languageSupported";
import Select from "react-select";

const LanguageSelect = ({
  value,
  onChange,
  theme = "light", // Add theme prop with default value
}: {
  value: string;
  onChange: (val: string) => void;
  theme?: "light" | "dark";
}) => {
  const colors = {
    light: {
      background: "#ffffff",
      text: "#18181b",
      border: "#e5e7eb",
      hoverBorder: "#a1a1aa",
      selectedBg: "#f3f4f6",
      hoveredBg: "#f9fafb",
    },
    dark: {
      background: "#1f2937",
      text: "#f9fafb",
      border: "#374151",
      hoverBorder: "#6b7280",
      selectedBg: "#374151",
      hoveredBg: "#4b5563",
    },
  };

  const currentTheme = colors[theme];

  return (
    <div style={{ display: "flex", alignItems: "center", height: 36 }}>
      <Select
        classNamePrefix="shadcn"
        value={monacoLanguagesForReactSelect.find((opt) => opt.value === value)}
        onChange={(option) => onChange(option?.value || "")}
        options={monacoLanguagesForReactSelect}
        isSearchable
        styles={{
          control: (base) => ({
            ...base,
            width: 140,
            height: 15,
            borderRadius: 6,
            backgroundColor: currentTheme.background,
            borderColor: currentTheme.border,
            boxShadow: "none",
            padding: 0,
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
              ? currentTheme.hoveredBg
              : currentTheme.background,
            color: currentTheme.text,
            display: "flex",
            alignItems: "center",
            padding: "8px 12px",
          }),
          singleValue: (base) => ({
            ...base,
            fontSize: 14,
            padding: 0,
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
        theme={(theme) => ({
          ...theme,
          borderRadius: 6,
          colors: {
            ...theme.colors,
            primary25: currentTheme.selectedBg,
            primary: currentTheme.hoverBorder,
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
