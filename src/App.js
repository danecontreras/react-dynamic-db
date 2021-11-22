import './App.css';
import Table from './components/Table.js'

import { Provider } from 'react-redux'
import store from './redux/store'

function App() {
  return (
    <Provider store={store}>
        <div className="App">
            <Table />
        </div>
    </Provider>
  );
}

export default App;
