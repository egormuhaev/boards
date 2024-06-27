import React from "react";

export enum AppRoutes {
  HOME = "home",
  BOARD = "board",
  NOT_FOUND = "not_found",
}

export interface RoutePropsCustom {
  path: string;
  element: React.ReactNode;
  isAuth?: boolean;
  role?: number;
  nestedRoutes?: RoutePropsCustom[];
}
