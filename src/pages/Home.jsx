import React, { useRef } from "react";
import { StartInfo } from "../components/StartInfo";
import { BlogList } from "../components/BlogList";
// import "./dist/main.css";
export const Home = () => {
  return (
    <div className="h-screen overflow-y-auto">
      {/* hero section  */}
      {/* <StartInfo /> */}

      {/* blog sec */}
     <BlogList/>
    </div>
  );
};
