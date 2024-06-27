import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h2>Boards</h2>

      <div>
        <Link to="/boards/1">Board 1</Link>
      </div>
    </div>
  );
};

export default Home;
