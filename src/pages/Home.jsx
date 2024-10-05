import React from "react";
import "../styles/Home.css";
import Typewriter from "typewriter-effect";

function Home() {
  return (
    <div className="home">
      <p>Adarsh Vidyalaya</p>
      <p>11/223 Souter Ganj, Kanpur</p>
      <Typewriter
        options={{
          strings: [
            "Excellence is not being the best; it is doing your best.",
            "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
          ],
          autoStart: true,
          loop: true,
          wrapperClassName: "typer",
          cursorClassName: "cursor",
        }}
      />
    </div>
  );
}

export default Home;
