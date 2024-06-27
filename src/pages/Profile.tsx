import { Link } from "react-router-dom";

const Profile = () => {
  return (
    <div className="flex gap-5 p-5 items-center">
      <Link
        to="/"
        className="h-8 bg-slate-500 rounded-lg box-border p-2 hover:bg-slate-300 flex items-center"
      >
        На главную
      </Link>
      <div>Профиль</div>
    </div>
  );
};

export default Profile;
