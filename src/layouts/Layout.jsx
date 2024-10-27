import React, { useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import "./layout.css";

export const Layout = () => {
  const nodeRef = useRef(null); // Reference for the animated div
  const location = useLocation();

  return (
    <div>
      <Navbar />
      <SwitchTransition>
        <CSSTransition
          timeout={200}
          classNames="fade"
          key={location.pathname}
          nodeRef={nodeRef} 
        >
          <div className="max-w-5xl mx-auto p-2" ref={nodeRef}>
            <Outlet />
          </div>
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
};
