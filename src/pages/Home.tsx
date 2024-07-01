import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="p-5 flex gap-5 flex-col">
      <h2>Страницы:</h2>

      <div className="flex gap-5">
        <Link
          to="/sign-in"
          className="h-8 bg-slate-500 rounded-lg box-border p-2 hover:bg-slate-300 flex items-center"
        >
          Авторизация
        </Link>
        <Link
          to="/sign-up"
          className="h-8 bg-slate-500 rounded-lg box-border p-2 hover:bg-slate-300 flex items-center"
        >
          Регистрация
        </Link>
        <Link
          to="/not-found"
          className="h-8 bg-slate-500 rounded-lg box-border p-2 hover:bg-slate-300 flex items-center"
        >
          Не найдено
        </Link>
        <Link
          to="/profile/1"
          className="h-8 bg-slate-500 rounded-lg box-border p-2 hover:bg-slate-300 flex items-center"
        >
          Профиль
        </Link>
      </div>

      <h2>Ваши доски:</h2>

      <div className="flex gap-5">
        <Link
          to="/boards/clxlirvxg0000ru4lc4sevksl"
          className="h-8 bg-slate-500 rounded-lg box-border p-2 hover:bg-slate-300 flex items-center"
        >
          Доска 1
        </Link>
        <Link
          to="/boards/clxxeic4400231qnx82o5jtqi"
          className="h-8 bg-slate-500 rounded-lg box-border p-2 hover:bg-slate-300 flex items-center"
        >
          Доска 2
        </Link>
      </div>
    </div>
  );
};

export default Home;
