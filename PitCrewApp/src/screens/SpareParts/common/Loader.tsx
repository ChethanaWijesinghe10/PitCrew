// src/common/Loader.tsx
import React from 'react';
import { Modal, View, ActivityIndicator, StyleSheet } from 'react-native';

type LoaderProps = {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
};

const Loader: React.FC<LoaderProps> = ({ modalVisible, setModalVisible }) => {
  return (
    <Modal
      transparent={true}
      animationType="none"
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator animating={modalVisible} size="large" color="#0000ff" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Loader;
