import React, { useContext } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useApiClient } from "../ApiProvider";

import { MocksContext } from '../MocksContext';
import { UserContext } from '../UserContext';
import { useTranslation } from 'react-i18next';

const ModalAddItem= ({list, setList, showAddItem, setShowAddItem, newItem, setNewItem}) => {

  const { t, i18n } = useTranslation();
  const { mockLists, setMockLists } = useContext(MocksContext);
  const { selectedUserId } = useContext(UserContext);

  // api 
  const api= useApiClient();
  
  const handleCloseAddItem = () => setShowAddItem(false);

  // add new item to the list
  const handleSaveAddItem = async () => {
    newItem.solved=false;

    try {
      const data= await api.addItemToList( list.id, selectedUserId, newItem);
      setList( data);
    } catch (error) {
      // let's update the mockLists[listId] and add the newItem
      const newLists= mockLists.map(item => {
        if( item.id === list.id) {
          item.items.push(newItem);
        }
        return item;
      });
      setMockLists( newLists);
      setList( { ...list, items: [ ...list.items, newItem ] });
    }
    
    handleCloseAddItem();
  };

  return (
    <Modal show={showAddItem} onHide={handleCloseAddItem} centered>
      <Modal.Header closeButton className="modal-content">
        <Modal.Title>{t('addNewItem')}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-content">
        <Form>
          <Form.Group controlId="formItemName">
            <Form.Label>{t('name')}:</Form.Label>
            <Form.Control
              type="text"
              value={newItem.name}
              autoFocus
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formItemCount">
            <Form.Label>{t('count')}:</Form.Label>
            <Form.Control
              type="text"
              value={newItem.count}
              onChange={(e) => setNewItem({ ...newItem, count: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formItemUnit">
            <Form.Label>{t('unit')}</Form.Label>
            <Form.Control
              type="text"
              value={newItem.unit}
              onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="modal-content">
        <Row>
          <Col>
            <Button variant="primary" onClick={handleSaveAddItem}>{t('ok')}</Button>
          </Col><Col>
            <Button variant="secondary" onClick={handleCloseAddItem}>{t('cancel')}</Button>
          </Col>
        </Row>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalAddItem;