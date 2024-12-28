import React, { useContext } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { getRandomId } from '../global';
import { useApiClient } from "../ApiProvider";

import { MocksContext } from '../MocksContext';
import { UserContext } from '../UserContext';
import { useTranslation } from 'react-i18next';

const ModalNewShoppingList= ({lists, setLists, showNewList, setShowNewList, newListName, setNewListName}) => {

  const { t, i18n } = useTranslation();
  const { mockLists, setMockLists } = useContext(MocksContext);
  const { selectedUserId } = useContext(UserContext);

  // api 
  const api= useApiClient();

  const handleCloseModal = () => setShowNewList(false);

  const handleNewList = async () => {
    
      let newItem = {
        ownerId: selectedUserId,
        name: newListName,
        archived: false,
        items: [],
        members: []
      };

      try {
        const data= await api.createShoppingList( selectedUserId, newItem);
        setLists([...lists, data]);
      } catch (error) {
        // update mockLists
        newItem.id = getRandomId();
        mockLists.push(newItem);
        setLists(mockLists);
      }

      handleCloseModal();
    };
      
  
  return (
    <Modal show={showNewList} onHide={handleCloseModal}>
      <Modal.Header closeButton className='modal-content'>
        <Modal.Title>{t('newShoppingList')}</Modal.Title>
      </Modal.Header>
      <Modal.Body className='modal-content'>
        <Form>
          <Form.Group controlId="formNewListName">
            <Form.Label>{t('shoppingListName')}</Form.Label>
            <Form.Control
              type="text"
              placeholder= {t('enterListName')}
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
            />  
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className='modal-content'>
        <Row>
          <Col>
            <Button variant="primary" onClick={handleNewList}>{t('ok')}</Button>
          </Col><Col>
            <Button variant="secondary" onClick={handleCloseModal}>{t('cancel')}</Button>
          </Col>
        </Row>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalNewShoppingList;