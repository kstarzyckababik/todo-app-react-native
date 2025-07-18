import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';

<Feather name="trash-2" size={20} color="red" />




type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export default function HomeScreen() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks();
  }, [tasks]);

  const loadTasks = async () => {
    const data = await AsyncStorage.getItem('TASKS');
    if (data) setTasks(JSON.parse(data));
  };

  const saveTasks = async () => {
    await AsyncStorage.setItem('TASKS', JSON.stringify(tasks));
  };
  const generateId = () => Date.now().toString();


  const addTask = () => {
    if (!task.trim()) return;
    setTasks([...tasks, { id: generateId(), title: task, completed: false }]);

    setTask('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My To-Do List</Text>
      <TextInput
        style={styles.input}
        placeholder="Add a task..."
        value={task}
        onChangeText={setTask}
      />
      <TouchableOpacity style={styles.addButton} onPress={addTask}>
       <Feather name="plus" size={16} color="white" />
       <Text style={styles.addButtonText}>  Add Task</Text>
      </TouchableOpacity>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.task}>
            <Text
              style={{
                textDecorationLine: item.completed ? 'line-through' : 'none',
              }}
              onPress={() => toggleTask(item.id)}
            >
              {item.title}
            </Text>
            <TouchableOpacity 
                onPress={() => removeTask(item.id)}
                style={{ padding: 5 }}>
             <Feather name="trash-2" size={20} color="red" />
            </TouchableOpacity>

          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop : 40, flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5,
  },
  task: {
    flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },  
});
