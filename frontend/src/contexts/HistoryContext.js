import { BackHandler, Alert } from "react-native";
import { useNavigate, useLocation } from "react-router-native";

import { createContext, useEffect, useState } from "react";
import MyModal from "../components/MyModal";

export const HistoryContext = createContext();

("Are you sure?");
("You will lose your streak!");
("Keep going");
("Menu");

export const HistoryContextProvider = ({ children }) => {
  const [myModal, setMyModal] = useState(<></>);
  const navigate = useNavigate();
  const location = useLocation();

  const backAction = () => {
    setMyModal(<></>);
    switch (location.pathname) {
      case "/":
        setMyModal(
          <MyModal
            Title="Hold on!"
            Info="Do you want to exit?"
            ContinueText="YES"
            CancelText="Cancel"
            ContinueTask={() => BackHandler.exitApp()}
          />
        );
        break;
      case "/MultiPlayer3D":
      case "/MultiPlayer":
        setMyModal(
          <MyModal
            Title="Hold on!"
            Info="Do you want to leave?"
            ContinueText="YES"
            CancelText="Cancel"
            To="/Lobby"
          />
        );
        break;

      case "/SinglePlayer3D":
        setMyModal(
          <MyModal
            Title="Hold on!"
            Info="Do you want to exit?"
            ContinueText="Keep Going"
            CancelText="EXIT"
            To="/SinglePlayerMenu"
          />
        );
        break;
      case "/SinglePlayer2D":
        navigate("/SinglePlayerMenu", { replace: true });
        break;

      case "/Friend":
        navigate("/Lobby", { replace: true });
        break;
      default:
        navigate("/", { replace: true });
    }
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [location]);

  return (
    <HistoryContext.Provider value={{ myModal, backAction }}>
      {children}
    </HistoryContext.Provider>
  );
};
