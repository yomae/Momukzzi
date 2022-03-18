import logo from "./logo.svg";
import "./App.css";
import Signup from "./Components/Signup/Signup";
import { createStore } from "redux";
import { Provider, useSelector, useDispatch, connect } from "react-redux";

function reducer(currentState, action) {
  if (currentState === undefined) {
    return {};
  }

  const newState = { ...currentState };
  return newState;
}
const store = createStore(reducer);

function App() {
  return (
    <div className="App">
      <Signup />
    </div>
  );
}

export default App;