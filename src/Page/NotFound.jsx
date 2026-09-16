import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  return (
    <main className="not-found">
      <div className="error-grid"></div>

      <div className="error-content">
        <span>CYBERSAGE://ERROR</span>

        <h1>404</h1>

        <h2>ACCESS DENIED</h2>

        <p>
          The resource you requested does not exist.
        </p>

        <div className="error-terminal">
          <span>&gt; scan()</span>
          <span>&gt; attempting recovery...</span>
          <span>&gt; recovery failed.</span>
          <strong>&gt; nice try.</strong>
        </div>

        <Link to="/">
          RETURN TO COMMAND CENTER
        </Link>
      </div>
    </main>
  );
}

export default NotFound;