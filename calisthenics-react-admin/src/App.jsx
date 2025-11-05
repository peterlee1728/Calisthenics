import Header from './components/Header';
import './App.scss';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="homepage">
          <h1>Welcome to Calisthenics Admin</h1>
          <p>This is a blank homepage ready for your content.</p>
        </div>
      </main>
    </div>
  );
}

export default App;
