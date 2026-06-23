import { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../../lib/supabase';
import TaskForm from '../../components/TaskForm';
import TaskItem, { type Task } from '../../components/TaskItem';

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

  // ── UI ───────────────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <View style={headerStyles.header}>
        <Text style={headerStyles.title}>TaskFlow</Text>
      </View>

      <TaskForm task={task} setTask={setTask} onAdd={addTask} />

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
  emptyText: { textAlign: 'center', color: '#aaa', marginTop: 40, fontSize: 15 },
});