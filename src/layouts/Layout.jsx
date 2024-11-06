import React, { useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import "./layout.css";
import useTheme from "../hooks/useTheme";

export const Layout = () => {
  const nodeRef = useRef(null); // Reference for the animated div
  const location = useLocation();
  let { theme, changeTheme } = useTheme();
  // console.log(theme);
  return (
    <div data-theme={`${theme}`} >
      <Navbar />
      <SwitchTransition>
        <CSSTransition
          timeout={200}
          classNames="fade"
          key={location.pathname}
          nodeRef={nodeRef}
        >
          <div className="max-w-5xl mx-auto p-2 " ref={nodeRef}>
            <Outlet />
          </div>
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
};
