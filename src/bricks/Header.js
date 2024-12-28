import React, { useContext } from 'react';
import { Navbar, Container, Button, Form, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { UserContext } from '../UserContext';
import { ThemeContext } from '../ThemeContext';

const Header = () => 
{
  const { t, i18n } = useTranslation();
  const { users, selectedUserEmail, updateUser } = useContext(UserContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleUserChange = (event) => {
    updateUser(event.target.value);
    navigate('/');
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  
  
  return (
    <Navbar className='navbar' expand="lg">
      <Container className='justify-content-between'> 
        <Navbar.Brand as={Link} to="/"><h1>{t('header.app.name')}</h1></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Row className="ms-auto w-100">
              <Col xs={12} md={6} lg={3} className="mb-2 mb-lg-0">
                <b>{t('header.language')}</b>
                <Form.Select onChange={(e) => changeLanguage(e.target.value)} defaultValue={i18n.language} className="mt-1">
                  <option value="en">{t('english')}</option>
                  <option value="cs">{t('czech')}</option>
                </Form.Select>   
              </Col>
              <Col xs={12} md={6} lg={3} className="mb-2 mb-lg-0">
                <b>{t('header.signed.in.as')}</b>
                <Form.Select value={selectedUserEmail} onChange={handleUserChange} className="mt-1">
                  {users.map((user, index) => (
                    <option key={index} value={user.email}>
                      {user.email}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col xs={12} md={6} lg={3} className="mb-2 mb-lg-0">
                <Button variant="secondary" onClick={toggleTheme} className="w-100 mt-1"> {theme === 'light' ? t('button.switch.to.dark.mode') : t('button.switch.to.light.mode')}</Button>
              </Col> 
            </Row>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;