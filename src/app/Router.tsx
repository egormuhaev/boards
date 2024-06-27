import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { AppRoutes, RoutePropsCustom } from "./types";
import { routesSchema } from "./router.config";

const Router = () => {
  type Routes =
    | Record<AppRoutes, RoutePropsCustom>[]
    | Record<AppRoutes, RoutePropsCustom>;

  function renderRoutes(routes: Routes) {
    return Object.values(routes).map((route) => (
      <Route key={route.path} path={route.path} element={route.element}>
        {route.nestedRoutes && renderRoutes(route.nestedRoutes)}
      </Route>
    ));
  }

  const routes = renderRoutes(routesSchema);

  return (
    <Suspense fallback={<div>Loading</div>}>
      <Routes>{routes}</Routes>
    </Suspense>
  );
};

export default Router;
