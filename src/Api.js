/**
 * This is the API client for our server
 */
import { HttpClient } from "./HttpClient.js";

class Api {
  constructor() {
    this.httpClient = new HttpClient();
  }

  getUsers() {
    return this.httpClient.get(`/users`);
  }

  getShoppingLists(userId) {
    return this.httpClient.get( '/shopping-lists', userId );
  }

  getShoppingList(listId, userId) {
    return this.httpClient.get(`/shopping-lists/${listId}`, userId);
  }

  updateShoppingList(listId, userId, data) {
    return this.httpClient.post( `/shopping-lists/${listId}`, userId, data );
  }

  deleteShoppingList(listId, userId) {
    return this.httpClient.delete(`/shopping-lists/${listId}`, userId);
  }

  createShoppingList(userId, data) {
    return this.httpClient.post(`/shopping-lists`, userId, data);
  }

  addItemToList( listId, selectedUserId, newItem) {
    return this.httpClient.post(`/shopping-lists/${listId}/add-item`, selectedUserId, newItem);
  }

  editListItem( listId, selectedUserId, editedItem  ) {
    return this.httpClient.post(`/shopping-lists/${listId}/edit-item`, selectedUserId, editedItem);
  }

  deletListItem( listId, selectedUserId, itemToDelete) {
    return this.httpClient.post(`/shopping-lists/${listId}/delete-item/${itemToDelete.id}`, selectedUserId);
  }

  inviteUser( listId, selectedUserId, newMemberId) {
    return this.httpClient.post(`/shopping-lists/${listId}/invite-user/${newMemberId}`, selectedUserId);
  }

  removeUser( listId, selectedUserId, memberToRemoveId) {
    return this.httpClient.post(`/shopping-lists/${listId}/remove-user/${memberToRemoveId}`, selectedUserId);
  }
}

export default Api;