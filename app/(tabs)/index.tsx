import { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { supabase } from '../../lib/supabase';
import TaskItem, { type Task } from '../../components/TaskItem';
import AddTaskModal from '../../components/AddTaskModal';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // ── Load ────────────────────────────────────────────────────────────────────
  async function loadTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      Toast.show({ type: 'error', text1: 'Failed to load tasks', text2: error.message });
    } else if (data) {
      setTasks(data as Task[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  // ── Add (modal submit) ───────────────────────────────────────────────────────
  async function handleSubmitTask(title: string) {
    const { error } = await supabase
      .from('tasks')
      .insert({ title, completed: false });

    if (error) {
      Toast.show({ type: 'error', text1: 'Could not add task', text2: error.message });
    } else {
      setModalVisible(false);
      await loadTasks();
      Toast.show({ type: 'success', text1: 'Task added!' });
    }
  }

  // ── Toggle ──────────────────────────────────────────────────────────────────
  async function toggleTask(item: Task) {
    const { error } = await supabase
      .from('tasks')
      .update({ completed: !item.completed })
      .eq('id', item.id);

    if (error) {
      Toast.show({ type: 'error', text1: 'Could not update task', text2: error.message });
    } else {
      await loadTasks();
    }
  }

  // ── Delete ──────────────────────────────────────────────────────────────────
  async function deleteTask(id: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      Toast.show({ type: 'error', text1: 'Could not delete task', text2: error.message });
    } else {
      await loadTasks();
      Toast.show({ type: 'success', text1: 'Task deleted' });
    }
  }

  // ── UI ───────────────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <View style={headerStyles.header}>
        <Text style={headerStyles.title}>TaskFlow</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2E5BBA" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem item={item} onToggle={toggleTask} onDelete={deleteTask} />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No tasks yet. Tap + to add one!</Text>
          }
        />
      )}

      {/* Floating action button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}
      >
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <AddTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmitTask}
      />
    </View>
  );
}

const headerStyles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1F2A44' },
});

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, backgroundColor: '#fff' },
  emptyText: { textAlign: 'center', color: '#aaa', marginTop: 40, fontSize: 15 },
  fab: {
    position: 'absolute',
    bottom: 36,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2E5BBA',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#2E5BBA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
});