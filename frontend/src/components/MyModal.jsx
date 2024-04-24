
import {
  StyleSheet,
  Modal,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import { useNavigate, useLocation, useHardwareBackButton } from "react-router-native";

import { useEffect, useState } from "react";
import { View } from "react-native-animatable";
import Text from "../components/Text";


const MyModal = ({Title, Info, ContinueText, GoBackText, to, isVisible=true}) => {
  const [visible, setVisible] = useState(isVisible)
  const navigate = useNavigate()
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        setVisible(false)
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <Text style={styles.text}>{Title}</Text>
          <Text style={styles.text}>{Info}</Text>
          <TouchableOpacity
            style={[styles.button, styles.buttonContinue]}
            onPress={() => {
              setVisible(false)
              navigate(to, { replace: true });
            }}
          >
            <Text style={styles.text}>{ContinueText}</Text>
          </TouchableOpacity>
          <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => {
                  setVisible(false)
                }}
              >
              <Text style={styles.text}>{GoBackText}</Text>
          </TouchableOpacity>
          
        </View>
      </View>
    </Modal>
  );
};

export default MyModal

const styles = StyleSheet.create({
  text: { fontSize: 20 },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0, 0.8)",
  },
  modalView: {
    margin: 10,
    backgroundColor: "rgba(255,225,50,0.9)",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    margin: 10,
    elevation: 4,
  },
  buttonCancel: {
    alignItems: "center",
    paddingVertical: 7,
    backgroundColor: "rgba(217, 121, 80, 0.8)",
    borderWidth: 1.5,
    borderBottomWidth: 4,
    borderColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 8,
  },
  buttonContinue: {
    alignItems: "center",
    paddingVertical: 10,
    marginTop: 30,
    backgroundColor: "rgba(123, 168, 50, 0.8)",
    borderWidth: 1.5,
    borderBottomWidth: 4,
    borderColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 8,
  },
});
