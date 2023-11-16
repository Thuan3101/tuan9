import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, TextInput, FlatList, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';

const API_BASE_URL = 'https://65445c195a0b4b04436c49cd.mockapi.io/note';

const App = () => {
  const [data, setData] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [selectedPriority, setPriority] = useState('red');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch(API_BASE_URL);
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const addNote = async () => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newNote, priority: selectedPriority }),
      });

      if (response.ok) {
        fetchNotes();
        setNewNote('');
        setPriority('red');
      } else {
        console.error('Error adding note:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const deleteNote = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchNotes();
      } else {
        console.error('Error deleting note:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.noteContainer}>
      <Text>{item.text}</Text>
      <Text>Priority: {item.priority}</Text>
      <Pressable onPress={() => deleteNote(item.id)}>
        <Text>Delete</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Add new note"
        value={newNote}
        onChangeText={(text) => setNewNote(text)}
      />
      <RadioButton.Group onValueChange={(value) => setPriority(value)} value={selectedPriority}>
        <View style={styles.priorityContainer}>
          <Text>Priority: </Text>
          <RadioButton.Item label="Red" value="red" />
          <RadioButton.Item label="Orange" value="orange" />
          <RadioButton.Item label="Green" value="green" />
        </View>
      </RadioButton.Group>
      <Pressable style={styles.addButton} onPress={addNote}>
        <Text>Add Note</Text>
      </Pressable>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  noteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    marginVertical: 10,
    padding: 10,
    backgroundColor: 'red',
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: 'cyan',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
});

export default App;
