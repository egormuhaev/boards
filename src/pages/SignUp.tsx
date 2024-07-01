import { mockUserState } from "@/app/Protect";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (mockUserState.isAuth) navigate("/");
  }, []);

  return (
    <div className="flex gap-5 p-5 items-center">
      <Link
        to="/"
        className="h-8 bg-slate-500 rounded-lg box-border p-2 hover:bg-slate-300 flex items-center"
      >
        На главную
      </Link>
      <div>Страница регистрации</div>
    </div>
  );
};

export default SignUp;
