import { lazy } from "react";

export const LazyHomePage = lazy(async () => await import("./Home.tsx"));
export const LazyBoardPage = lazy(async () => await import("./Board.tsx"));
