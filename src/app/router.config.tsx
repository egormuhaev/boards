import {
  LazyBoardPage,
  LazyHomePage,
  LazyNotFoundPage,
  LazyProfilePage,
  LazySignInPage,
  LazySignUpPage,
} from "@/pages/index.ts";
import { AppRoutes, RoutePropsCustom } from "./types.ts";

export const RoutePaths: Record<AppRoutes, string> = {
  [AppRoutes.HOME]: "/",
  [AppRoutes.BOARD]: "/boards/:id",
  [AppRoutes.SIGN_IN]: "/sign-in",
  [AppRoutes.SIGN_UP]: "/sign-up",
  [AppRoutes.PROFILE]: "/profile/:id",
  [AppRoutes.NOT_FOUND]: "*",
};

export const appRoles = {
  ADMIN: 999999,
  USER: 1,
};

export const routesSchema: Record<AppRoutes, RoutePropsCustom> = {
  [AppRoutes.HOME]: {
    path: RoutePaths.home,
    element: <LazyHomePage />,
    isAuth: true,
  },
  [AppRoutes.BOARD]: {
    path: RoutePaths.board,
    element: <LazyBoardPage />,
    isAuth: true,
  },
  [AppRoutes.SIGN_IN]: {
    path: RoutePaths.sign_in,
    element: <LazySignInPage />,
  },
  [AppRoutes.SIGN_UP]: {
    path: RoutePaths.sign_up,
    element: <LazySignUpPage />,
  },
  [AppRoutes.PROFILE]: {
    path: RoutePaths.profile,
    element: <LazyProfilePage />,
    isAuth: true,
    role: 2,
  },
  [AppRoutes.NOT_FOUND]: {
    path: RoutePaths.not_found,
    element: <LazyNotFoundPage />,
  },
};
