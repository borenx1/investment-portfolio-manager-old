import TopAppBar from './TopAppBar';
import logo from './logo.svg';

function App() {
  return (
    <div>
      <header>
        <TopAppBar />
      </header>
      <main>
        <img src={logo} alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
      </main>
    </div>
  );
}

export default App;
