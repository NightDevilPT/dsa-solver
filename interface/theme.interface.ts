import type { PropsWithChildren } from "react";
import type { Locale } from "@/i18n/dictionaries";

export type ThemeMode = "light" | "dark" | "system";

export type ResolvedThemeMode = Exclude<ThemeMode, "system">;

export enum ColorScheme {
  Default = "default",
  Blue = "blue",
  Green = "green",
  Orange = "orange",
  Red = "red",
  Rose = "rose",
  Violet = "violet",
  Yellow = "yellow",
}

export type SidebarState = "expanded" | "collapsed";
export type SidebarVariant = "sidebar" | "floating" | "inset";
export type SidebarSide = "left" | "right";
export type ViewMode = "grid" | "table";

export interface ThemeProviderConfig {
  /**
   * Theme mode to use when no user preference is stored.
   */
  defaultThemeMode?: ThemeMode;
  /**
   * Color scheme to use when no preference is set by the user.
   */
  defaultColorScheme?: ColorScheme;
  /**
   * Preferred locale to use as the initial language.
   */
  defaultLocale?: Locale;
  /**
   * List of color schemes available in the product.
   */
  availableColorSchemes?: ColorScheme[];
  /**
   * Default sidebar state when nothing is persisted.
   */
  defaultSidebarState?: SidebarState;
  /**
   * Default sidebar variant when nothing is persisted.
   */
  defaultSidebarVariant?: SidebarVariant;
  /**
   * Default sidebar side when nothing is persisted.
   */
  defaultSidebarSide?: SidebarSide;
  /**
   * Default view mode (grid/table) when nothing is persisted.
   */
  defaultViewMode?: ViewMode;
}

export type ThemeProviderProps = PropsWithChildren<ThemeProviderConfig>;

export interface ThemeContextValue {
  themeMode: ThemeMode;
  resolvedThemeMode: ResolvedThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleThemeMode: () => void;
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  availableColorSchemes: ColorScheme[];
  locale: Locale;
  setLocale: (locale: Locale) => void;
  sidebarState: SidebarState;
  setSidebarState: (state: SidebarState) => void;
  toggleSidebarState: () => void;
  sidebarVariant: SidebarVariant;
  setSidebarVariant: (variant: SidebarVariant) => void;
  sidebarSide: SidebarSide;
  setSidebarSide: (side: SidebarSide) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

