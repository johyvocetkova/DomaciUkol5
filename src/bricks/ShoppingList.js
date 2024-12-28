import React, { useState, useEffect, useContext }  from 'react';
import { Container, Row, Col, Button,  Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useApiClient } from "../ApiProvider";

import { MocksContext } from '../MocksContext';
import { UserContext } from '../UserContext';
import { useTranslation } from 'react-i18next';

import ModalEditListName from './ModalEditListName';
import ModalLeaveList from './ModalLeaveList';
import ModalEditMembers from './ModalEditMembers';
import ModalAddItem from './ModalAddItem';
import ModalEditItem from './ModalEditItem';
import ModalDeleteItem from './ModalDeleteItem';

const ShoppingList = () => 
{
  const {id}= useParams();
  const [list, setList] = useState(null);
  const { t, i18n } = useTranslation();
  const { mockLists, setMockLists } = useContext(MocksContext);

  const { selectedUserId, getUserEmailById, userIdsToEmails } = useContext(UserContext);
  // api
  const api= useApiClient();

  const [showEditName, setShowEditName] = useState(false);
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);
  const [showEditMembers, setShowEditMembers] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showEditItem, setShowEditItem] = useState(false);
  const [showDeleteItem, setShowDeleteItem] = useState(false);
  const [newName, setNewName] = useState('');
  const [newItem, setNewItem] = useState({ name: '', count: '', unit: '', solved: false });
  const [newMember, setNewMember] = useState('');
  const [currentItemIndex, setCurrentItemIndex] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    
    // fetch the list
    const fetchItem = async () => {

      try {
        const data = await api.getShoppingList(id, selectedUserId);
        setList(data);
      } catch (error) {
        // let's update the mockLists and merge in updated item
        const data= mockLists.find(list => list.id === id);
        setList(data);
      };
    };

    if( selectedUserId) {
      fetchItem();
    }

  }, [id]);
 
  if (!list) return <div>Loading...</div>;

  const handleShowEdit = () => {
    setNewName(list.name);
    setShowEditName(true);
  }; 

  const handleShowConfirmLeave = () => {
    setNewName(list.name);
    setShowConfirmLeave(true);
  }; 

  const handleShowAddItem = () => setShowAddItem(true);

  const handleShowEditItem = (id) => {
    var index=list.items.findIndex(item => item.id === id);
    setCurrentItemIndex(index);
    setNewItem(list.items[index]);
    setShowEditItem(true);
  };

  const handleShowDeleteItem = (id) => {
    var index=list.items.findIndex(item => item.id === id);
    setCurrentItemIndex(index);
    setItemToDelete(list.items[index]);
    setShowDeleteItem(true);
  };

  const handleShowEditMembers = () => setShowEditMembers(true);

  const toggleSolved = async (toggledId) => {

    let updatedItem = list.items.find( item =>item.id == toggledId  );
    updatedItem.solved= !updatedItem.solved;

    try {
      const data = await api.editListItem(id, selectedUserId, updatedItem);
      setList(data);
    } catch (error) {
      // let's update the mockLists and merge in updated item
      const newLists = mockLists.map(list => list.id === id ? { ...list, items: list.items.map(item => item.id === toggledId ? updatedItem : item) } : list);
      setMockLists(newLists);
      setList(newLists.find(list => list.id === id));
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const filteredItems = list.items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'All' || 
                          (filterStatus === 'Solved' && item.solved) || 
                          (filterStatus === 'Unresolved' && !item.solved);
    return matchesSearch && matchesFilter;
  });

  return (
    <Container>

      <Row style={{ height: '20px' }}>
      </Row>

      <Row className="fs-1">
        <Col>{list.name}   {list.ownerId === selectedUserId && (<Button variant="primary" onClick={handleShowEdit} className="ml-3">{t('button.edit')}</Button>)}</Col> 
      </Row>

      <Row style={{ height: '20px' }}>
      </Row>

      <Row>
        <Col><b>{t('owner')}:</b> {getUserEmailById(list.ownerId)}<br/><b>{t('members')}:</b> {userIdsToEmails(list.members).join(", ")} &nbsp;  
        {list.ownerId !== selectedUserId && (
            <Button variant="primary" onClick={handleShowConfirmLeave} className="btn-sm">{t('button.leave')}</Button>
        )}
        {list.ownerId === selectedUserId && (
            <Button variant="primary" onClick={handleShowEditMembers} className="btn-sm ml-2">{t('header.edit.members')}</Button>
        )}

        </Col>
      </Row>

      <Row style={{ height: '40px' }}>
      </Row>

      <Row className="mt-3">
        <Col>
          <Form.Control
            type="text"
            placeholder= {t('searchName')}
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Col>
        <Col></Col>
        <Col></Col>
        <Col>
          <Form.Select value={filterStatus} onChange={handleFilterChange}>
            <option value="All">{t('all')}</option>
            <option value="Solved">{t('solved')}</option>
            <option value="Unresolved">{t('unresolved')}</option>
          </Form.Select>
        </Col>
        <Col></Col>
      </Row>

      <Row className="fw-bold">
        <Col>{t('name')}</Col>
        <Col>{t('count')}</Col>
        <Col>{t('unit')}</Col>
        <Col>{t('solved')}</Col>
        <Col>{t('actions')}</Col>
      </Row>

      {filteredItems.map((item, index) => (
        <Row key={index} className="border-top py-2">
          <Col>{item.name}</Col>
          <Col>{item.count}</Col>
          <Col>{item.unit}</Col>
          <Col onClick={() => toggleSolved(filteredItems.at(index).id)} style={{ cursor: 'pointer' }}>
            {item.solved ? t('button.yes') : t('button.no')}
          </Col>
          <Col>
            <Button variant="secondary" className="btn-sm" onClick={() => handleShowEditItem(filteredItems.at(index).id)}>
              {t('button.edit')}
            </Button>
            &nbsp;
            <Button variant="danger" className="btn-sm ml-2" onClick={() => handleShowDeleteItem(filteredItems.at(index).id)}>
              {t('button.delete')}
            </Button>
          </Col>
        </Row>
      ))}

      <Row>
        <Col>
          <Button variant="primary" onClick={handleShowAddItem} className="mt-3 btn-sm">{t('addNewItem')}</Button>
        </Col>
        <Col/>
        <Col/>
        <Col/>
        <Col/>
      </Row>

      <ModalEditListName
        list= {list}
        setList= {setList}
        id={list.id}
        name={list.name}
        newName={newName}
        setNewName={setNewName}
        showEditName={showEditName}
        setShowEditName={setShowEditName}
      />

      <ModalLeaveList
        list= {list}
        setList= {setList}
        newName= {newName}
        showConfirmLeave= {showConfirmLeave}
        setShowConfirmLeave= {setShowConfirmLeave}
      />

      <ModalEditMembers 
        list= {list}
        setList= {setList}
        showEditMembers= {showEditMembers}
        setShowEditMembers= {setShowEditMembers}
        newMember= {newMember}
        setNewMember= {setNewMember}
      />

      <ModalAddItem 
        list= {list}
        setList= {setList}
        showAddItem= {showAddItem}
        setShowAddItem= {setShowAddItem}
        newItem= {newItem}
        setNewItem= {setNewItem}
      />

      <ModalEditItem 
        list= {list}
        setList= {setList}
        showEditItem= {showEditItem}
        setShowEditItem= {setShowEditItem}
        newItem= {newItem}
        setNewItem= {setNewItem}
      />

      <ModalDeleteItem
        list= {list}
        setList= {setList}  
        showDeleteItem= {showDeleteItem}
        setShowDeleteItem={setShowDeleteItem}
        itemToDelete= {itemToDelete}
      />

    </Container>
  );
};

export default ShoppingList;
