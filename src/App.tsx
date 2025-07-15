import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Homepage } from "./pages/homepage/Homepage";
import { Exercises } from "./pages/exercises/Exercises";
import { Provider } from "react-redux";
import store from "./store/store.config";
import "./utils/i18n/i18n";

function App() {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/exercises" element={<Exercises />} />
      </Routes>
    </Provider>
  );
}

export default App;
