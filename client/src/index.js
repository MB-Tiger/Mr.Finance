import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import MyRoutes from "./router/MyRoutes";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import ContextProvider from "./context/context";
import client from "./apollo/apolloClient";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <ContextProvider>
        <React.StrictMode>
          <MyRoutes />
        </React.StrictMode>
      </ContextProvider>
    </ApolloProvider>
  </BrowserRouter>
);

reportWebVitals();
