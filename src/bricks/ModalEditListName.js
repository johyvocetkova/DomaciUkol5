import React, { useContext} from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useApiClient } from "../ApiProvider";

import { MocksContext } from '../MocksContext';
import { UserContext } from '../UserContext';
import { useTranslation } from 'react-i18next';

const ModalEditListName= ({list, setList, newName, setNewName, showEditName, setShowEditName}) => {

    const { t, i18n } = useTranslation();
    const { mockLists, setMockLists } = useContext(MocksContext);
    const { selectedUserId } = useContext(UserContext);

    // api 
    const api= useApiClient();
  
    const handleCloseEditName = () => setShowEditName(false);

    const handleSaveEditName = async () => {

        try {
            const data= await api.updateShoppingList( list.id, selectedUserId, { name: newName });
            setList( data);
        } catch (error) {
            // let's update the mockLists[listId] and assign the new name
            const newLists= mockLists.map(item => {
                if( item.id === list.id) {
                    item.name= newName;
                }
                return item;
            });
            setMockLists( newLists);
            setList( { ...list, name: newName });
        }

        handleCloseEditName();
    };
    
    return (
        <Modal show={showEditName} onHide={handleCloseEditName} centered>
            <Modal.Header closeButton className="modal-content">
                <Modal.Title>{t('shoppingListName')}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-content"> 
                <Form>
                    <Form.Group controlId="formListName">
                    <Form.Control
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        autoFocus
                    />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className="modal-content">
                <Row>
                    <Col>
                        <Button variant="primary" onClick={handleSaveEditName}>{t('ok')}</Button>
                    </Col><Col>
                        <Button variant="secondary" class="me-2" onClick={handleCloseEditName}>{t('cancel')}</Button>
                    </Col>
                </Row>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalEditListName;
