import { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
};

export default function AddTaskModal({ visible, onClose, onSubmit }: Props) {
  const [text, setText] = useState('');

  function handleAdd() {
    if (text.trim() === '') return;
    onSubmit(text.trim());
    setText('');
  }

  function handleCancel() {
    setText('');
    onClose();
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleCancel}
    >
      {/* Dark backdrop — tap to close */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={handleCancel}
      />

      {/* Sheet */}
      <View style={styles.sheet}>
        <Text style={styles.heading}>New Task</Text>

        <TextInput
          style={styles.input}
          placeholder="What needs to be done?"
          placeholderTextColor="#aaa"
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
          autoFocus
        />

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
    gap: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2A44',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: '#1F2A44',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: '#5A6472',
    fontWeight: '600',
    fontSize: 15,
  },
  addBtn: {
    flex: 1,
    backgroundColor: '#2E5BBA',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
