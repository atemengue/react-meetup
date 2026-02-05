import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ContextExample from './modules/context-example/ContextExample';
import { ThemeProvider } from './modules/context-example/ThemeContext';
import ReduxExample from './modules/redux-example/ReduxExample';
import { store } from './modules/redux-example/store';
import UseReducerExample from './modules/useReducer-example/UseReducerExample';
import UseStateExample from './modules/useState-example/UseStateExample';
import ZustandExample from './modules/zustand-example/ZustandExample';
import Home from './pages/Home';

const App = () => {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="usestate" element={<UseStateExample />} />
              <Route path="usereducer" element={<UseReducerExample />} />
              <Route path="context" element={<ContextExample />} />
              <Route path="redux" element={<ReduxExample />} />
              <Route path="zustand" element={<ZustandExample />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ReduxProvider>
  );
};

export default App;
