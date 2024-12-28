import React, { useContext} from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useApiClient } from "../ApiProvider";

import { MocksContext } from '../MocksContext';
import { UserContext } from '../UserContext';
import { useTranslation } from 'react-i18next';

const ModalEditItem= ({list, setList, showEditItem, setShowEditItem, newItem, setNewItem}) => {

  const { t, i18n } = useTranslation();
  const { mockLists, setMockLists } = useContext(MocksContext);
  const { selectedUserId } = useContext(UserContext);

  // api 
  const api= useApiClient();
    
  const handleCloseEditItem = () => setShowEditItem(false);

  const handleSaveEditItem = async () => {

    try {
      const data= await api.editListItem( list.id, selectedUserId, newItem);
      setList( data);
    }
    catch (error) {
      // let's update the mockLists[listId] and add the newItem
      const newLists= mockLists.map(item => {
        if( item.id === list.id) {
          item.items= item.items.map(i => i.id === newItem.id ? newItem : i);
        }
        return item;
      });
      setMockLists( newLists);
      setList( { ...list, items: list.items.map(i => i.id === newItem.id ? newItem : i) });
    }

    handleCloseEditItem();
  };

  return (
    <Modal show={showEditItem} onHide={handleCloseEditItem} centered>
      <Modal.Header closeButton className="modal-content"> 
        <Modal.Title>{t('header.edit.item')}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-content">
        <Form>
          <Form.Group controlId="formEditItemName">
            <Form.Label>{t('name')}</Form.Label>
            <Form.Control
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              autoFocus
            />
          </Form.Group>
          <Form.Group controlId="formEditItemCount">
            <Form.Label>{t('count')}</Form.Label>
            <Form.Control
              type="text"
              value={newItem.count}
              onChange={(e) => setNewItem({ ...newItem, count: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formEditItemUnit">
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
            <Button variant="primary" onClick={handleSaveEditItem}>{t('ok')}</Button>
          </Col><Col>
            <Button variant="secondary" onClick={handleCloseEditItem}>{t('cancel')}</Button>
          </Col>
        </Row>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalEditItem;