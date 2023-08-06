import React, {createContext, useState, useContext} from "react";

const FormContext = createContext();

export default function FormProvider ({children}) {
    const [formState, setFormState] = useState({});

    const resetForm = () => {
        setFormState({});
    };

    return (
        <FormContext.Provider value={{formState, setFormState, resetForm}}>
            {children}
        </FormContext.Provider>
    );
};

export  function useFormContext(){
    return useContext(FormContext);
}
