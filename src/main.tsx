import React from "react";
import ReactDOM from "react-dom/client";

import { RecoilRoot } from "recoil";

import App from "./App";
import Fallback from "./components/Fallback";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <React.Suspense fallback={<Fallback />}>
        <App />
      </React.Suspense>
    </RecoilRoot>
  </React.StrictMode>
);
