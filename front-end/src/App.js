import { RouterProvider } from 'react-router-dom';
import DataProvider from './context/userContext';
import { router } from './routes/index.js';

function App() {
  return (
    <div className='App'>
      <DataProvider>
        <RouterProvider router={router} >
        </RouterProvider>
      </DataProvider>
    </div>
  );
}

export default App;
