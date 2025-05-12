import { createContext, useContext, useState } from 'react';
import { Theme } from "@radix-ui/themes";

const SettingsContext = createContext();

export function SettingsProvider({ children }) {

  const [themeAppearance, setThemeAppearance] = useState("dark");
  const [themeAccentColor, setThemeAccentColor] = useState("indigo");

  const [mapProvider, setMapProvider] = useState(localStorage.getItem("mapProvider") || "openstreetmap");

  return (
    <SettingsContext.Provider
      value={{
        themeAppearance, setThemeAppearance,
        themeAccentColor, setThemeAccentColor,
        mapProvider, setMapProvider,
      }}>
      <Theme className="theme" accentColor={themeAccentColor} grayColor="slate" radius="full" scaling="100%" appearance={themeAppearance}>
        {children}
      </Theme>
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  return useContext(SettingsContext);
}