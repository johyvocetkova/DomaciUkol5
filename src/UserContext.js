import React, { createContext, useState, useEffect, useContext } from 'react';
import { MocksContext } from './MocksContext';
import { useApiClient } from "./ApiProvider";

export const UserContext = createContext();

export const UserProvider = ({ children }) => 
{
    // api client
    const api = useApiClient();
      
    // mock users
    const { mockUsers } = useContext(MocksContext);

    // users - an aray of {id,email}
    const [users, setUsers] = useState([]);
    const [selectedUserEmail, setSelectedUserEmail] = useState( "" );  
    const [selectedUserId, setSelectedUserId] = useState( "" );  
  
    useEffect(() => {

      const fetchUsers = async () => {  
        let data= null

        try {
          data = await api.getUsers();
          setUsers( data);
        } catch (error) {
          console.error("Error fetching users:", error);
        } 

        if( !data || data.length === 0) {
          data= mockUsers;
          setUsers(data);
        }

        setSelectedUserEmail(data[0].email);
        setSelectedUserId(data[0].id);
      };
    
      fetchUsers();
    }, [api]);


    // update the selected user by email value, used when selecting user
    const updateUser = (email) => {
      const user = getUserByEmail(email);
      setSelectedUserEmail(user.email);
      setSelectedUserId(user.id);
    };

    // returns the user object by id or null if not found
    const getUserById = (userId) => {

      if( users === undefined || users.length === 0 || userId === undefined) {
        return null;
      }

      const user = users.find(user => user.id == userId);

      return user || null;
    };  
  
    // returns the user object by email or null if not found
    const getUserByEmail = (email) => {

      if( users === undefined || users.length === 0 || email === undefined) {
        return null;
      }

      const user = users.find(user => user.email === email);

      return user || null;
    }

    // returns the user email by id or empty string if not found
    const getUserEmailById = (userId) => {

      const user = getUserById(userId);

      return user ? user.email : "";
    }

    // userIds is an array of user ids
    const userIdsToEmails = (userIds) => {
      return userIds? userIds.map(id => getUserEmailById(id)) : [];
    }
  
  
    return (
      <UserContext.Provider value={{ users, getUserByEmail, getUserById, getUserEmailById, userIdsToEmails, selectedUserEmail, selectedUserId, updateUser }}>
        {children}
      </UserContext.Provider>
    );
};
