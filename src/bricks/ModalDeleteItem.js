import React, { useContext } from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import { useApiClient } from "../ApiProvider";

import { MocksContext } from '../MocksContext';
import { UserContext } from '../UserContext';
import { useTranslation } from 'react-i18next';

const ModalDeletItem= ({list, setList, showDeleteItem, setShowDeleteItem, itemToDelete}) => {

  const { t, i18n } = useTranslation();
  const { mockLists, setMockLists } = useContext(MocksContext);
  const { selectedUserId } = useContext(UserContext);

  // api 
  const api= useApiClient();
    
  const handleCloseDeleteItem = () => setShowDeleteItem(false);
  
  const handleDeleteItem = async () => {

    try {
      const data= await api.deletListItem( list.id, selectedUserId, itemToDelete);
      setList( data);
    }
    catch (error) {
      // let's update the mockLists[listId] and remove the itemToDelete
      const newLists= mockLists.map(item => {
        if( item.id === list.id) {
          item.items= item.items.filter(item => item.id !== itemToDelete.id);
        }
        return item;
      });
      setMockLists( newLists);
      setList( { ...list, items: list.items.filter(item => item.id !== itemToDelete.id) });
    };

    handleCloseDeleteItem();
  };

  return (
    <Modal show={showDeleteItem} onHide={handleCloseDeleteItem} centered>
      <Modal.Header closeButton className="modal-content">
        <Modal.Title>{t('header.confirm.delete')}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-content">
        {t('confirmDelete', { itemName: itemToDelete?.name })}
      </Modal.Body>
      <Modal.Footer className="modal-content">
        <Row>
          <Col>
            <Button variant="danger" onClick={handleDeleteItem}>{t('button.yes')}</Button>
          </Col><Col>
            <Button variant="secondary" onClick={handleCloseDeleteItem}>{t('button.no')}</Button>
          </Col>
        </Row>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalDeletItem;