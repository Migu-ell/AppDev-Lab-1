import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
};

type Props = {
  item: Task;
  onToggle: (item: Task) => void;
  onDelete: (id: string) => void;
};

export default function TaskItem({ item, onToggle, onDelete }: Props) {
  return (
    <TouchableOpacity
      style={styles.taskRow}
      onPress={() => onToggle(item)}
      onLongPress={() => onDelete(item.id)}
      activeOpacity={0.7}
    >
      <MaterialIcons
        name={item.completed ? 'check-box' : 'check-box-outline-blank'}
        size={20}
        color={item.completed ? '#2E5BBA' : '#5A6472'}
      />
      <Text style={[styles.taskText, item.completed && styles.taskTextDone]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  taskText: { fontSize: 15, flex: 1 },
  taskTextDone: { textDecorationLine: 'line-through', color: '#aaa' },
});
