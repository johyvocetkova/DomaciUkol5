// ApiProvider.js
import React, { createContext, useContext } from "react";
import Api from "./Api.js";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const apiClient = new Api();

  return (
    <ApiContext.Provider value={apiClient}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApiClient = () => useContext(ApiContext);
