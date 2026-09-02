export type NavItem = { path: string; label: string; icon: string };

export const NAV_ITEMS: NavItem[] = [
  { path: "/", label: "Home", icon: "home" },
  { path: "/explore", label: "Explore", icon: "explore" },
  { path: "/diaries/new", label: "Add", icon: "add_circle" },
  { path: "/tripbook", label: "Trip", icon: "auto_stories" },
  { path: "/map", label: "Map", icon: "map" },
];
