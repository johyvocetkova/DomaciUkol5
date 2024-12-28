import React, {useContext} from 'react';
import { Modal, Button, Row, Col} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useApiClient } from "../ApiProvider";

import { MocksContext } from '../MocksContext';
import { UserContext } from '../UserContext';
import { useTranslation } from 'react-i18next';

const ModalLeaveList= ({list, setList, newName, showConfirmLeave, setShowConfirmLeave}) => {

  const { t, i18n } = useTranslation();
  const { mockLists, setMockLists } = useContext(MocksContext);

  // api
  const api = useApiClient();

  const { selectedUserId } = useContext(UserContext);
  const navigate = useNavigate();

  const handleCloseConfirmLeave = () => setShowConfirmLeave(false);

  const handleLeave = async () => {

    try {
      const data = await api.removeUser(list.id, selectedUserId, selectedUserId);
      setList(data);
    } catch (error) {
      // let's update the mockLists[listId] and remove the selectedUserId
      const newLists= mockLists.map(item => {
        if( item.id === list.id) {
          item.members= item.members.filter(m => m !== selectedUserId);
        }
        return item;
      });
      setMockLists( newLists);
    }

    navigate('/');
  }

  return (
    <Modal show={showConfirmLeave} onHide={handleCloseConfirmLeave} centered>
      <Modal.Header closeButton className='modal-content'>
        <Modal.Title>{t('confirm.leave')}</Modal.Title>
      </Modal.Header>
      <Modal.Body className='modal-content'>
        {t('confirmLeaveList', { listName: newName })}
      </Modal.Body>
      <Modal.Footer>
        <Row>
          <Col>
            <Button variant="danger" onClick={handleLeave}>{t('button.yes')}</Button>
          </Col><Col>
            <Button variant="secondary" onClick={handleCloseConfirmLeave}>{t('button.no')}</Button>
          </Col>
        </Row>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalLeaveList;