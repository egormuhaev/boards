import React from "react";

export enum AppRoutes {
  HOME = "home",
  BOARD = "board",
  NOT_FOUND = "not_found",
  SIGN_IN = "sign_in",
  SIGN_UP = "sign_up",
  PROFILE = "profile",
}

export interface RoutePropsCustom {
  path: string;
  element: React.ReactNode;
  isAuth?: boolean;
  role?: number;
  nestedRoutes?: RoutePropsCustom[];
}
