import { BrowserRouter, Routes, Route } from "react-router-dom";
import * as routes from './constants/routes';

import DefaultLayout from './components/layout/DefaultLayout';
import Home from './components/Home';
import NoPage from './components/Common/NoPage';

const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.HOME} element={<DefaultLayout />}>
          <Route index element={<Home />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;