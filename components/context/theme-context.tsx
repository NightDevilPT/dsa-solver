"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTheme } from "next-themes";
import {
  ColorScheme,
  ThemeContextValue,
  ThemeMode,
  ThemeProviderProps,
  ResolvedThemeMode,
  SidebarState,
  SidebarVariant,
  SidebarSide,
  ViewMode,
} from "@/interface/theme.interface";
import {
  locales as availableLocales,
  LocaleEnum,
} from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/dictionaries";

const STORAGE_NAMESPACE = "app-preferences";
const STORAGE_KEYS = {
  themeMode: `${STORAGE_NAMESPACE}:theme-mode`,
  colorScheme: `${STORAGE_NAMESPACE}:color-scheme`,
  locale: `${STORAGE_NAMESPACE}:locale`,
  sidebarState: `${STORAGE_NAMESPACE}:sidebar-state`,
  sidebarVariant: `${STORAGE_NAMESPACE}:sidebar-variant`,
  sidebarSide: `${STORAGE_NAMESPACE}:sidebar-side`,
  viewMode: `${STORAGE_NAMESPACE}:view-mode`,
} as const;

const FALLBACK_THEME_MODE: ThemeMode = "system";
const FALLBACK_COLOR_SCHEME = ColorScheme.Default;
const FALLBACK_SIDEBAR_STATE: SidebarState = "expanded";
const FALLBACK_SIDEBAR_VARIANT: SidebarVariant = "sidebar";
const FALLBACK_SIDEBAR_SIDE: SidebarSide = "left";
const FALLBACK_VIEW_MODE: ViewMode = "grid";

const DEFAULT_AVAILABLE_COLOR_SCHEMES = Object.values(ColorScheme) as ColorScheme[];

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const isColorScheme = (value: unknown): value is ColorScheme =>
  typeof value === "string" &&
  (DEFAULT_AVAILABLE_COLOR_SCHEMES as string[]).includes(value as string);

const isLocale = (value: unknown): value is Locale =>
  typeof value === "string" &&
  (availableLocales as string[]).includes(value as string);

const SIDEBAR_VARIANTS: SidebarVariant[] = ["sidebar", "floating", "inset"];
const SIDEBAR_SIDES: SidebarSide[] = ["left", "right"];

const THEME_MODES: ThemeMode[] = ["light", "dark", "system"];

const isThemeMode = (value: unknown): value is ThemeMode =>
  typeof value === "string" && (THEME_MODES as string[]).includes(value as string);

const isSidebarVariant = (value: unknown): value is SidebarVariant =>
  typeof value === "string" &&
  (SIDEBAR_VARIANTS as string[]).includes(value as string);

const isSidebarSide = (value: unknown): value is SidebarSide =>
  typeof value === "string" &&
  (SIDEBAR_SIDES as string[]).includes(value as string);

const VIEW_MODES: ViewMode[] = ["grid", "table"];

const isViewMode = (value: unknown): value is ViewMode =>
  typeof value === "string" &&
  (VIEW_MODES as string[]).includes(value as string);

export const ThemeContextProvider = ({
  children,
  defaultThemeMode = FALLBACK_THEME_MODE,
  defaultColorScheme = FALLBACK_COLOR_SCHEME,
  defaultLocale = LocaleEnum.En,
  availableColorSchemes = DEFAULT_AVAILABLE_COLOR_SCHEMES,
  defaultSidebarState = FALLBACK_SIDEBAR_STATE,
  defaultSidebarVariant = FALLBACK_SIDEBAR_VARIANT,
  defaultSidebarSide = FALLBACK_SIDEBAR_SIDE,
  defaultViewMode = FALLBACK_VIEW_MODE,
}: ThemeProviderProps) => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const mergedAvailableSchemes = useMemo(() => {
    const set = new Set<ColorScheme>([...availableColorSchemes, defaultColorScheme]);
    return Array.from(set);
  }, [availableColorSchemes, defaultColorScheme]);

  const [colorScheme, setColorSchemeState] =
    useState<ColorScheme>(defaultColorScheme);
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [sidebarState, setSidebarStateInternal] =
    useState<SidebarState>(defaultSidebarState);
  const [sidebarVariant, setSidebarVariantInternal] =
    useState<SidebarVariant>(defaultSidebarVariant);
  const [sidebarSide, setSidebarSideInternal] =
    useState<SidebarSide>(defaultSidebarSide);
  const [viewMode, setViewModeInternal] =
    useState<ViewMode>(defaultViewMode);

  const initializedThemeMode = useRef(false);

  useEffect(() => {
    if (initializedThemeMode.current) return;
    initializedThemeMode.current = true;

    const storedThemeMode = window.localStorage.getItem(STORAGE_KEYS.themeMode);
    if (storedThemeMode && isThemeMode(storedThemeMode)) {
      setTheme(storedThemeMode);
    } else if (defaultThemeMode) {
      setTheme(defaultThemeMode);
    }
  }, [defaultThemeMode, setTheme]);

  useEffect(() => {
    const storedScheme = window.localStorage.getItem(STORAGE_KEYS.colorScheme);
    if (storedScheme && isColorScheme(storedScheme)) {
      setColorSchemeState(storedScheme);
    } else {
      setColorSchemeState(defaultColorScheme);
    }
  }, [defaultColorScheme]);

  useEffect(() => {
    const storedLocale = window.localStorage.getItem(STORAGE_KEYS.locale);
    if (storedLocale && isLocale(storedLocale)) {
      setLocaleState(storedLocale);
    } else {
      setLocaleState(defaultLocale);
    }
  }, [defaultLocale]);

  useEffect(() => {
    const storedSidebarState = window.localStorage.getItem(STORAGE_KEYS.sidebarState);
    if (storedSidebarState === "expanded" || storedSidebarState === "collapsed") {
      setSidebarStateInternal(storedSidebarState);
    } else {
      setSidebarStateInternal(defaultSidebarState);
    }
  }, [defaultSidebarState]);

  useEffect(() => {
    const storedSidebarVariant = window.localStorage.getItem(STORAGE_KEYS.sidebarVariant);
    if (storedSidebarVariant && isSidebarVariant(storedSidebarVariant)) {
      setSidebarVariantInternal(storedSidebarVariant);
    } else {
      setSidebarVariantInternal(defaultSidebarVariant);
    }
  }, [defaultSidebarVariant]);

  useEffect(() => {
    const storedSidebarSide = window.localStorage.getItem(STORAGE_KEYS.sidebarSide);
    if (storedSidebarSide && isSidebarSide(storedSidebarSide)) {
      setSidebarSideInternal(storedSidebarSide);
    } else {
      setSidebarSideInternal(defaultSidebarSide);
    }
  }, [defaultSidebarSide]);

  useEffect(() => {
    const storedViewMode = window.localStorage.getItem(STORAGE_KEYS.viewMode);
    if (storedViewMode && isViewMode(storedViewMode)) {
      setViewModeInternal(storedViewMode);
    } else {
      setViewModeInternal(defaultViewMode);
    }
  }, [defaultViewMode]);

  useEffect(() => {
    document.documentElement.dataset.colorScheme = colorScheme;
    window.localStorage.setItem(STORAGE_KEYS.colorScheme, colorScheme);
  }, [colorScheme]);

  useEffect(() => {
    if (theme) {
      window.localStorage.setItem(STORAGE_KEYS.themeMode, theme as ThemeMode);
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem(STORAGE_KEYS.locale, locale);
  }, [locale]);

  useEffect(() => {
    document.documentElement.dataset.sidebarState = sidebarState;
    window.localStorage.setItem(STORAGE_KEYS.sidebarState, sidebarState);
  }, [sidebarState]);

  useEffect(() => {
    document.documentElement.dataset.sidebarVariant = sidebarVariant;
    window.localStorage.setItem(STORAGE_KEYS.sidebarVariant, sidebarVariant);
  }, [sidebarVariant]);

  useEffect(() => {
    document.documentElement.dataset.sidebarSide = sidebarSide;
    window.localStorage.setItem(STORAGE_KEYS.sidebarSide, sidebarSide);
  }, [sidebarSide]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.viewMode, viewMode);
  }, [viewMode]);

  const setThemeMode = useCallback(
    (mode: ThemeMode) => {
      setTheme(mode);
    },
    [setTheme],
  );

  const toggleThemeMode = useCallback(() => {
    const nextMode = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(nextMode);
  }, [resolvedTheme, setTheme]);

  const setColorScheme = useCallback(
    (scheme: ColorScheme) => {
      const nextScheme = mergedAvailableSchemes.includes(scheme)
        ? scheme
        : mergedAvailableSchemes[0] ?? FALLBACK_COLOR_SCHEME;
      setColorSchemeState(nextScheme);
    },
    [mergedAvailableSchemes],
  );

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
  }, []);

  const setSidebarState = useCallback((nextState: SidebarState) => {
    setSidebarStateInternal(nextState);
  }, []);

  const toggleSidebarState = useCallback(() => {
    setSidebarStateInternal((current) =>
      current === "expanded" ? "collapsed" : "expanded",
    );
  }, []);

  const setSidebarVariant = useCallback((nextVariant: SidebarVariant) => {
    setSidebarVariantInternal(nextVariant);
  }, []);

  const setSidebarSide = useCallback((nextSide: SidebarSide) => {
    setSidebarSideInternal(nextSide);
  }, []);

  const setViewMode = useCallback((nextMode: ViewMode) => {
    setViewModeInternal(nextMode);
  }, []);

  const value = useMemo<ThemeContextValue>(() => {
    const currentTheme = (theme ?? defaultThemeMode) as ThemeMode;
    const resolved = ((resolvedTheme ?? "light") === "dark"
      ? "dark"
      : "light") as ResolvedThemeMode;

    return {
      themeMode: currentTheme,
      resolvedThemeMode: resolved,
      setThemeMode,
      toggleThemeMode,
      colorScheme,
      setColorScheme,
      availableColorSchemes: mergedAvailableSchemes,
      locale,
      setLocale,
      sidebarState,
      setSidebarState,
      toggleSidebarState,
      sidebarVariant,
      setSidebarVariant,
      sidebarSide,
      setSidebarSide,
      viewMode,
      setViewMode,
    };
  }, [
    theme,
    defaultThemeMode,
    resolvedTheme,
    setThemeMode,
    toggleThemeMode,
    colorScheme,
    setColorScheme,
    mergedAvailableSchemes,
    locale,
    setLocale,
    sidebarState,
    setSidebarState,
    toggleSidebarState,
    sidebarVariant,
    setSidebarVariant,
    sidebarSide,
    setSidebarSide,
    viewMode,
    setViewMode,
  ]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useThemeContext = (): ThemeContextValue => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeContextProvider");
  }

  return context;
};

