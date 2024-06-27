import { Link } from "react-router-dom";

interface ProtectProps {
  route: { isAuth?: boolean; role?: number };
  children: JSX.Element;
}

export const mockUserState = {
  user: null,
  isAppReady: true,
  isAuth: true,
  role: 1,
};

const Protect = ({ route, children }: ProtectProps) => {
  if (!mockUserState.isAppReady) return <div>Loading</div>;

  if (!route.isAuth) {
    return children;
  } else {
    if (!mockUserState.isAuth) {
      return (
        <div className="flex gap-5">
          <Link to="/sign-in">Авторизуйтесь</Link>
          <span>или</span>
          <Link to="/sign-up">Зарегистрируйтесь</Link>
        </div>
      );
    } else {
      if (route.role && route.role > mockUserState.role) {
        return <div>Доступ запрещен</div>;
      }
    }
  }

  return children;
};

export default Protect;
