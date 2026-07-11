import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import StandaloneApp from "./app/StandaloneApp";
import "./styles-standalone.css";

createRoot(document.getElementById("root")!)
    .render(
        <StrictMode>
            <StandaloneApp />
        </StrictMode>
    );
