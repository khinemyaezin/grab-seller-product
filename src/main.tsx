import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import StandaloneApp from "./app/StandaloneApp";
import "./styles.css";

createRoot(document.getElementById("root")!)
    .render(
        <StrictMode>
            <StandaloneApp />
        </StrictMode>
    );
