import {createContext, useContext, useState, useEffect} from "react";

const StateContext = createContext({
  user: null,
  token: null,
  notification: null,
  formData: {},
  setUser: () => {},
  setToken: () => {},
  setNotification: () => {},
  setFormData: () => {},
})

export const ContextProvider = ({children}) => {
  const [user, setUser] = useState({});
  const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));
  const [notification, _setNotification] = useState('');
  const [formData, _setFormData] = useState({});

  const setToken = (token) => {
    _setToken(token)
    if (token) {
      localStorage.setItem('ACCESS_TOKEN', token);
    } else {
      localStorage.removeItem('ACCESS_TOKEN');
    }
  }

  //to keep form data
  const setFormData = (data) => {
    _setFormData(data);
  };

  // Load form data from context when the component mounts
  useEffect(() => {
    setFormData(context.formData);
  }, []);

  const setFormDataInContext = (data) => {    
    // Update local state
    setFormData(data);
  };

  const context = {
    formData,
    setFormData: setFormDataInContext,
  };

  const setNotification = message => {
    _setNotification(message);

    setTimeout(() => {
      _setNotification('')
    }, 5000)
  }

  return (
    <StateContext.Provider value={{
      user,
      setUser,
      token,
      setToken,
      notification,
      setNotification,
      context
    }}>
      {children}
    </StateContext.Provider>
  );
}

export const useStateContext = () => useContext(StateContext);
