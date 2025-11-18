import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts';
import { Layou
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <h1 className="text-4xl font-bold text-gray-900">ByteBite</h1>
                <p className="mt-4 text-gray-600">编程语言对比学习平台</p>
              </div>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
