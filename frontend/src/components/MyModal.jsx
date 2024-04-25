
import {
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useNavigate } from "react-router-native";

import { useState } from "react";
import { View } from "react-native-animatable";
import Text from "../components/Text";

const MyModal = ({Title='Are you sure?', Info="", ContinueText='Leave', CancelText='Cancel', To="", ContinueTask=() => null, CancelTask=() => null, SetHide=() => null}) => {
  const [visible, setVisible] = useState(true)
  const navigate = useNavigate()
  
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        setVisible(false)
        SetHide(false)
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <Text style={styles.text}>{Title}</Text>
          {Info && <Text style={styles.text}>{Info}</Text>}

          <TouchableOpacity
                style={[styles.button, styles.buttonContinue]}
                onPress={() => {
                  ContinueTask()
                  setVisible(false)
                  SetHide(false)
                  if (To) navigate (To, { replace: true });
                }}
              >
              <Text style={styles.text}>{ContinueText}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonCancel]}
            onPress={() => {
              setVisible(false)
              SetHide(false)
              CancelTask()
            }}
          >
            <Text style={styles.text}>{CancelText}</Text>
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
    backgroundColor: "rgba(0,0,0, 0.6)",
  },
  modalView: {
    backgroundColor: "rgba(255,225,50,0.9)",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    margin: 10,
    marginTop: 30,
    elevation: 4,
    borderWidth: 1.5,
    borderBottomWidth: 4,
    borderColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 8,
  },
  buttonCancel: {
    backgroundColor: "rgba(123, 168, 50, 0.8)",

  },
  buttonContinue: {
    backgroundColor: "rgba(217, 121, 80, 0.8)",
  },
});
