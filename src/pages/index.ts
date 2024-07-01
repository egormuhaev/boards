import { lazy } from "react";

export const LazyHomePage = lazy(async () => await import("./Home.tsx"));
export const LazyBoardPage = lazy(async () => await import("./Board.tsx"));
export const LazySignInPage = lazy(async () => await import("./SignIn.tsx"));
export const LazySignUpPage = lazy(async () => await import("./SignUp.tsx"));
export const LazyProfilePage = lazy(async () => await import("./Profile.tsx"));
export const LazyNotFoundPage = lazy(
  async () => await import("./NotFound.tsx"),
);
