import { Link } from "react-router-dom";

export const Homepage = () => {
  return (
    <div className="homepage">
      <nav>
        <Link to="/exercises">Exercises</Link>
      </nav>
    </div>
  );
};
