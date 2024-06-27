import { LazyBoardPage, LazyHomePage } from "@/pages/index.ts";
import { AppRoutes, RoutePropsCustom } from "./types.ts";

export const RoutePaths: Record<AppRoutes, string> = {
  [AppRoutes.HOME]: "/",
  [AppRoutes.BOARD]: "/boards/:id",
  [AppRoutes.NOT_FOUND]: "*",
};

export const appRoles = {
  ADMIN: 2,
  USER: 1,
};

export const routesSchema: Record<AppRoutes, RoutePropsCustom> = {
  [AppRoutes.HOME]: {
    path: RoutePaths.home,
    element: <LazyHomePage />,
  },
  [AppRoutes.BOARD]: {
    path: RoutePaths.board,
    element: <LazyBoardPage />,
  },
  [AppRoutes.NOT_FOUND]: {
    path: RoutePaths.not_found,
    element: <h1>NOT_FOUND_PAGE 404</h1>,
  },
};
