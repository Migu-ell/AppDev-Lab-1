import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';

type Task = {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
};

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Load ────────────────────────────────────────────────────────────────────
  async function loadTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setTasks(data as Task[]);
    setLoading(false);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  // ── Add ─────────────────────────────────────────────────────────────────────
  async function addTask() {
    if (task.trim() === '') return;
    const { error } = await supabase
      .from('tasks')
      .insert({ title: task.trim(), completed: false });

    if (!error) {
      setTask('');
      await loadTasks();
    }
  }

  // ── Toggle ──────────────────────────────────────────────────────────────────
  async function toggleTask(item: Task) {
    const { error } = await supabase
      .from('tasks')
      .update({ completed: !item.completed })
      .eq('id', item.id);

    if (!error) await loadTasks();
  }

  // ── Delete ──────────────────────────────────────────────────────────────────
  async function deleteTask(id: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (!error) await loadTasks();
  }

  // ── Render item ─────────────────────────────────────────────────────────────
  function renderItem({ item }: { item: Task }) {
    return (
      <TouchableOpacity
        style={styles.taskRow}
        onPress={() => toggleTask(item)}
        onLongPress={() => deleteTask(item.id)}
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

  // ── UI ───────────────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <View style={headerStyles.header}>
        <Text style={headerStyles.title}>TaskFlow</Text>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter Task"
          value={task}
          onChangeText={setTask}
          onSubmitEditing={addTask}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <MaterialIcons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2E5BBA" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No tasks yet. Add one above!</Text>
          }
        />
      )}
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
  inputRow: { flexDirection: 'row', marginBottom: 20 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#2E5BBA',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  emptyText: { textAlign: 'center', color: '#aaa', marginTop: 40, fontSize: 15 },
});