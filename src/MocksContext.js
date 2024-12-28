import React, { createContext, useState } from 'react';

import mockUserData from './mockUsers.json';
import mockListsData from './mockLists.json';

export const MocksContext = createContext();

export const MocksProvider = ({ children }) => 
{
    const [mockUsers] = useState( mockUserData);
    const [mockLists, setMockLists] = useState( mockListsData);
  
    return (
      <MocksContext.Provider value={{ mockUsers, mockLists, setMockLists }}>
        {children}
      </MocksContext.Provider>
    );
};
