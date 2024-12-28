import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './UserContext';
import { MocksProvider } from './MocksContext';
import { ApiProvider } from "./ApiProvider";
import Header from './bricks/Header';
import Home from './bricks/Home';
import ShoppingList from './bricks/ShoppingList';

function App() 
{
  return (
    <MocksProvider>
      <ApiProvider>
        <UserProvider>
          <Router>
            <Header/>
            <Routes>
              <Route path="/" element={<Home/>} />
              <Route path="/shopping-list/:id" element={<ShoppingList/>} />          
          </Routes>
          </Router>
        </UserProvider>
      </ApiProvider>
    </MocksProvider>
  );
}

export default App;
