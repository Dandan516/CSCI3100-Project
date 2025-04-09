import { createContext, useContext, useState } from 'react';
import { Theme } from "@radix-ui/themes";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [appearance, setAppearance] = useState("dark");

  return (
    <ThemeContext.Provider value={{ appearance, setAppearance }}>
      <Theme className="theme" accentColor="indigo" grayColor="slate" radius="full" scaling="100%" appearance={appearance}>
        {children}
      </Theme>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  return useContext(ThemeContext);
}