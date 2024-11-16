import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Header from "./Layers/Header";
import Community from "./Layers/Sections/Community";
import Registration from "./Layers/Sections/Registration";
import Citizen from "./Layers/Sections/Citizen";
import Census from "./Layers/Sections/Census";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

declare global {
  interface Window {
    vlayer: any;
    ethereum: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
    };
  }
}

function App() {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: "940ded85-9118-418c-b3d5-9292948cfaa4", // Replace with your Dynamic environment ID
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Community />} />
          <Route path="/community" element={<Community />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/citizens" element={<Census />} />
          <Route path="/citizen/:id" element={<Citizen />} />
        </Routes>
      </Router>
    </DynamicContextProvider>
  );
}

export default App;
