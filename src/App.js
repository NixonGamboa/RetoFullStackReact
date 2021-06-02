import "./App.css";
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  useState,
} from "react";

const HOST_API = "http://localhost:8080/api";
const initialState = {
  list: [],
};

const Store = createContext(initialState);

const Form = () => {
  const formRef = useRef(null);

  const { dispatch } = useContext(Store);
  const [state, setState] = useState({});

  const onAdd = (event) => {
    event.preventDefault();

    const request = {
      name: state.name,
      id: null,
      isCompleted: false,
    };

    fetch(HOST_API + "/save", {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((todo) => {
        dispatch({ type: "add-item", item: todo });
        setState({ name: "" });
        formRef.current.reset();
      });
  };

  return (
    <form ref={formRef}>
      <input
        type="text"
        name="name"
        onChange={(event) => {
          setState({ ...state, name: event.target.value });
        }}
      ></input>
      <button onClick={onAdd}>Crear</button>
    </form>
  );
};

const List = () => {
  const { dispatch, state } = useContext(Store);

  useEffect(() => {
    fetch(HOST_API)
      .then((response) => response.json())
      .then((list) => {
        dispatch({ type: "update-list", list });
      });
  }, [state.list.length, dispatch]);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <td>ID</td>
            <td>Nombre</td>
            <td>¿Completo?</td>
          </tr>
        </thead>
        <tbody>
          {state.list.map((todo) => {
            return (
              <tr key={todo.id}>
                <td>{todo.id}</td>
                <td>{todo.name}</td>
                <td>{todo.isCompleted}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

function App() {
  return (
    <StoreProvider>
      <h3>To-Do List</h3>
      <Form />
      <List />
    </StoreProvider>
  );
}

function reducer(state, action) {
  switch (action.type) {
    case "update-list":
      return { ...state, state: action.list };
    case "add-item":
      const newList = state.list;
      newList.push(action.item);
      return { ...state, list: newList };
    default:
      return state;
  }
}

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Store.Provider value={{ state, dispatch }}>{children}</Store.Provider>
  );
};

export default App;
