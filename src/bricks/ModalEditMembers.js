import React, { useContext } from 'react';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import { useApiClient } from "../ApiProvider";

import { MocksContext } from '../MocksContext';
import { UserContext } from '../UserContext';
import { useTranslation } from 'react-i18next';


const ModalEditMembers = ({ list, setList, showEditMembers, setShowEditMembers, newMember, setNewMember }) => {

  const { t, i18n } = useTranslation();
  const { mockLists, setMockLists } = useContext(MocksContext);
  const { users, getUserEmailById, selectedUserId } = useContext(UserContext);

  // api
  const api = useApiClient();

  const handleCloseEditMembers = () => setShowEditMembers(false);

  const handleAddMember = async () => {

    if (!newMember || list.members.includes(newMember)) {
      return;
    }

    try {
      const data = await api.inviteUser(list.id, selectedUserId, newMember);
      setList(data);
    } catch (error) {
      const newLists= mockLists.map(item => {
        if( item.id === list.id) {
          item.members.push(newMember);
        }
        return item;
      });
      setMockLists( newLists);
      setList( newLists.find(item => item.id === list.id));
    }

    setNewMember('');
  };

  const handleRemoveMember = async (memberId) => {
    
    if( !memberId) return;

    try {
      const data = await api.removeUser(list.id, selectedUserId, memberId);
      setList(data);
    } catch (error) {
      // let's update the mockLists[listId] and remove the member
      const newLists= mockLists.map(item => {
        if( item.id === list.id) {
          item.members= item.members.filter(m => m !== memberId);
        }
        return item;
      });
      setMockLists( newLists);
      setList( newLists.find(item => item.id === list.id));
    }
  };

  const remainingUsers = () => {
    if (!users) return [];
    const remaining= users.filter(user => 
      !list.members.includes(user.id) && 
      !list.members.includes(String(user.id)) &&
      user.id != list.ownerId);
    return remaining;
  }

  return (
    <Modal show={showEditMembers} onHide={handleCloseEditMembers} centered>
      <Modal.Header closeButton className="modal-content">
        <Modal.Title>{t('header.edit.members')}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-content">
        <Table striped bordered hover className="table">
          <thead>
            <tr>
              <th>{t('members')}</th>
              <th>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {list.members.map((member, index) => (
              <tr key={index}>
                <td>{getUserEmailById(member)}</td>
                <td>
                  <Button variant="danger" className="btn-sm" onClick={() => handleRemoveMember(member)}>
                    {t('button.remove')}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Form>
        <Form.Group controlId="formNewMember">
            <Form.Label>{t('new.member')}</Form.Label>
            <Form.Control
              as="select"
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
              autoFocus
            >
              <option value="">{t('select.user')}</option>
              {remainingUsers().map((user, index) => (
                <option key={index} value={user.id}>
                  {user.email}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Button variant="primary" className="mt-2" onClick={handleAddMember}>
            {t('button.add.member')}
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer className="modal-content">
        <Button variant="secondary" onClick={handleCloseEditMembers}>
          {t('button.close')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEditMembers;
