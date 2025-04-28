import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Button, Text, Alert } from 'react-native';
import ContactList from '../../component/ContactList';
import { requestContactPermission, fetchContacts } from '../../utils/contactUtils';
import { insertContact, getAllSelectedContacts, deleteContact } from '../../utils/sqlite';
import useBLE from "../../utils/useBLE.js";


const App = () => {
  const { connectandsync} = useBLE();
  const [contacts, setContacts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [saveDisabled, setSaveDisabled] = useState(true);
  const deviceId = 1279407989;
  const [persistedContacts, setPersistedContacts] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        const permissionGranted = await requestContactPermission();
        if (permissionGranted && isMounted) {
          // Fetch all contacts from the phone
          const allContacts = await fetchContacts();
          // Fetch all saved contacts from SQLite
          const persisted = await getAllSelectedContacts();
          setPersistedContacts(persisted);
          // Merge persisted selection state with fetched contacts
          const updatedContacts = allContacts.map((contact) => {
            const phoneNumber = contact.phoneNumbers?.[0]?.number || '';
            const isSelected = !!persistedContacts.find(
              (persistedContact) => persistedContact.Mobile_Number === phoneNumber
            );
            return {
              ...contact,
              selected: isSelected,
            };
          });
          // Update the state with merged contacts
          const sortedContacts = updatedContacts.sort((a, b) =>
            (a.displayName || '').localeCompare(b.displayName || '')
          );
          setContacts(sortedContacts);

          // Commented out logic for initially disabling Save Changes
          // setSaveDisabled(selectedContacts.length === persistedContacts.length && 
          //   selectedContacts.every(contact => persistedContacts.some(p => p.Mobile_Number === contact.mobile)));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    // Commented out logic for enabling/disabling Save Changes
    // const selectedContacts = contacts.filter(contact => contact.selected);
    // const persistedContacts = contacts.filter(contact => contact.persisted); // Assuming persisted state is tracked
    // const hasChanges =
    //   selectedContacts.length > 0 || // Newly selected contacts
    //   persistedContacts.some(persistedContact => !selectedContacts.includes(persistedContact)); // Deselected contacts
    // setSaveDisabled(selectedContacts.length === 0 && persistedContacts.length === 0);
    useEffect(() => {
      setSaveDisabled(contacts.filter(c => c.selected).length === 0);
    }, [contacts]);
  }, [contacts]);

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    const updatedContacts = contacts.map((contact) => ({
      ...contact,
      selected: !selectAll,
    }));
    setContacts(updatedContacts);
  };

  const toggleSelectContact = (recordID) => {
    const updatedContacts = contacts.map((contact) => {
      if (contact.recordID === recordID) {
        return { ...contact, selected: !contact.selected };
      }
      return contact;
    });
    setContacts(updatedContacts);
  };

  const saveChanges = async () => {
    try {
      const selectedContacts = getSelectedContacts();
      const persistedContacts = await getAllSelectedContacts();
      // Find newly selected contacts (to insert)
      const newSelectedContacts = selectedContacts.filter(
        (contact) =>
          !persistedContacts.some(
            (persistedContact) => persistedContact.Mobile_Number === contact.mobile
          )
      );
      // Find deselected contacts (to delete)
      const deselectedContacts = persistedContacts.filter(
        (persistedContact) =>
          !selectedContacts.some(
            (contact) => contact.mobile === persistedContact.Mobile_Number
          )
      );
      // Insert newly selected contacts into SQLite
      for (const contact of newSelectedContacts) {
        await insertContact({
          Device_Id: deviceId,
          Contact_Name: contact.name,
          Mobile_Number: contact.mobile,
          Country_Code: contact.countryCode || '',
        });
        console.log(contact.name, 'saved in local table successfully.');
      }
      
      //Syncing selected contacts to watch
      Alert.alert("We are trying to sync contacts, please make sure your watch is nearby.");
     
      // Delete deselected contacts from SQLite
      for (const contact of deselectedContacts) {
        await deleteContact(deviceId, contact.Mobile_Number);
        console.log(`Contact ${contact.Contact_Name} (${contact.Mobile_Number}) deleted successfully.`);
      }
      Alert.alert('Success', 'Changes saved successfully.');

      await connectandsync(true);


      // Commented out logic to disable Save Changes after saving
      // setSaveDisabled(true);
    } catch (error) {
      console.error('Error saving changes:', error);
      Alert.alert('Error', 'Failed to save changes.');
    }
  };

  const getSelectedContacts = () => {
    return contacts
      .filter((contact) => contact.selected)
      .map((contact) => {
        const phoneNumber = contact.phoneNumbers?.[0];
        const countryCode = phoneNumber?.countryCode || '';
        return {
          name: contact.displayName,
          mobile: phoneNumber?.number || 'N/A',
          countryCode,
        };
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>All Contacts in your Phone</Text>
      <View style={styles.topRow}>
        {/* Removed disabled prop to always enable Save Changes */}
        <Button title="Save Changes" onPress={saveChanges} color="#F6B5B5" disabled={saveDisabled} />
      </View>
      <ContactList
        color="#F8E6E6"
        contacts={contacts}
        toggleSelectContact={toggleSelectContact}
        selectAll={selectAll}
        toggleSelectAll={toggleSelectAll}
      />
      <Text style={styles.heading}>Saved Contacts</Text>
      <ContactList
        color="#E6F8E6"
        contacts={persistedContacts}
        toggleSelectContact={toggleSelectContact}
        selectAll={selectAll}
        toggleSelectAll={toggleSelectAll}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8E6E6',
    padding: 16,
  },
  heading: {
    fontSize: 24,
    margin: 10,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  topRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#F6DADA',
    borderRadius: 8,
  },
});

export default App;