import React,  { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useApiClient } from "../ApiProvider";
import { MocksContext } from '../MocksContext';
import { UserContext } from '../UserContext';

import ModalNewShoppingList from './ModalNewShoppingList';

const Home = () => 
{
  const { t, i18n } = useTranslation();
  const { mockLists, setMockLists } = useContext(MocksContext);
  const { selectedUserId, getUserEmailById, userIdsToEmails } = useContext(UserContext);
  
  // api 
  const api= useApiClient();

  // testing list
  const [lists, setLists] = useState( []); 
  const [filter, setFilter] = useState('Active');
  const [searchQuery, setSearchQuery] = useState('');

  // check lists and remove all if the user is not a member or not an owner of the list
  const filterSelectedUsersLists = (allLists) => {
    if( !allLists || !selectedUserId) return [];  
    return allLists.filter(list => list.members.includes(selectedUserId) || list.ownerId == selectedUserId);
  };
  
  // reload shopping lists
  useEffect(() => {

    const fetchShoppingLists = async () => {   

      let allLists= null;

      try {
        allLists = await api.getShoppingLists( selectedUserId);
      } catch (error) {
        // ignore, will use the mock data
        allLists = null;
      }

      if( !allLists ) {
        allLists = mockLists;
      }

      const visibleLists = filterSelectedUsersLists(allLists);
      setLists(visibleLists);
    };

    if( selectedUserId) {
      fetchShoppingLists();
    }
  }, [selectedUserId]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const filteredItems = lists.filter(item => {
    const matchesFilter = filter === 'All' || (filter === 'Active' && !item.archived) || (filter === 'Archived' && item.archived);
    const matchesSearchQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearchQuery;
  });

  // toglle archive status handler
  const toggleArchiveStatus = async (item) => {
    const action = item.archived ? t('restore') : t('archive');
    const confirmation = window.confirm(t('confirmAction', { action }));
    if (!confirmation) {
      return;
    }

    // update it on the server and update the lists
    try {
      const data= await api.updateShoppingList( item.id, selectedUserId, { archived: !item.archived })
      setLists(lists => lists.map(list => list.id === item.id ? { ...list, ...data } : list));
    } catch (error) { 
      console.error('Error deleting item:', error);
      // let's update the mockLists
      const newLists= mockLists.map(list => list.id === item.id ? { ...list, archived: !list.archived } : list);
      setMockLists(newLists);
      const filteredNewList= filterSelectedUsersLists(newLists);
      setLists(filteredNewList);
    }
 };

  // Delete shopping list handler
  const deleteItem = async (item) => {
    const confirmation = window.confirm(t('confirmDelete', { itemName: item.name }));
    if (!confirmation) {
      return;
    }

    try {
      await api.deleteShoppingList(item.id, selectedUserId);
      setLists(lists => lists.filter(list => list.id !== item.id));
    } catch (error) {
      console.error('Error deleting item:', error);
      // let's update the mockLists
      const newLists = mockLists.filter(list => list.id !== item.id);
      setMockLists(newLists);
      setLists(newLists);
    }
  }

  // the following code is for the new list modal
  const [showNewList, setShowNewList] = useState(false);
  const [newListName, setNewListName] = useState('');

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };


  return (
    <Container>
        <Row className="fs-4">
        {t('chooseShoppingList')}
      </Row>

      <Row style={{ height: '20px' }}></Row>

      <Row>
        <Col>
          <Form.Control
            type="text"
            placeholder={t('searchName')}
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Col>
        <Col>
          {t('displayItems')} <select onChange={(e) => setFilter(e.target.value)} value={filter}>
            <option value="Active">{t('active')}</option>
            <option value="Archived">{t('archived')}</option>
            <option value="All">{t('all')}</option>
          </select> {t('items')}
        </Col>
        <Col></Col>
        <Col></Col>
      </Row>

      <Row style={{ height: '20px' }}></Row>

      <Row>
        {filteredItems.map(item => (
          <Col key={item.id} sm={12} md={6} lg={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>
                  <Link to={`/shopping-list/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {item.name}
                  </Link>
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  <Link to={`/shopping-list/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  {t('owner')}: {getUserEmailById(item.ownerId)}
                  </Link>
                </Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">
                  <Link to={`/shopping-list/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  {t('members')}: {userIdsToEmails(item.members).join(', ')}
                  </Link>
                </Card.Subtitle>
                <Card.Text>
                {t('archived.items')}: {item.archived ? t('yes') : t('no')}
                </Card.Text>
                {item.ownerId === selectedUserId && (
                  <Button variant="secondary" onClick={(e) => { e.stopPropagation(); toggleArchiveStatus(item); }} className="mx-2">
                    {item.archived ? t('button.restore') : t('button.archive')}
                  </Button>
               )}
                {item.ownerId === selectedUserId && (
                  <Button variant="danger" onClick={(e) => { e.stopPropagation(); deleteItem(item); }}>{t('button.delete')}</Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row style={{ height: '20px' }}></Row>

      <Row>
        <Col>
          <Button onClick={() => setShowNewList(true)}>{t('button.new.shopping.list')}</Button>
        </Col>
      </Row>

      <ModalNewShoppingList
        lists= {lists}
        setLists= {setLists}
        mockLists= {mockLists}
        showNewList= {showNewList}
        setShowNewList= {setShowNewList}
        newListName= {newListName}
        setNewListName= {setNewListName}
      />

    </Container>
  );
}

export default Home;