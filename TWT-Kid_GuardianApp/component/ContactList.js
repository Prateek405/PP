import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Image,
} from "react-native";
import CheckBox from "@react-native-community/checkbox";
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // or any icon library

const defaultContactImage = require("../asset/img/contact2.png");

const ContactList = ({
  contacts,
  toggleSelectContact,
  selectAll,
  toggleSelectAll,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredContacts = contacts.filter((contact) =>
    contact.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder=" Search Contact..... "
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <View style={styles.topRow}>
        <CheckBox value={selectAll} onValueChange={toggleSelectAll} />
        <Text style={styles.text}>All Contacts</Text>
      </View>
      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.recordID.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.contactItem,
              item.selected && styles.contactItemSelected,
            ]}
            onStartShouldSetResponder={() => true}
            onResponderGrant={() => toggleSelectContact(item.recordID)}
          >
            {item.hasThumbnail ? (
              <Image
                style={styles.thumbnail}
                source={{ uri: item.thumbnailPath }}
              />
            ) : (
              <Image style={styles.thumbnail} source={defaultContactImage} />
            )}
            <CheckBox
              value={item.selected}
              onValueChange={() => toggleSelectContact(item.recordID)}
            />
            <Text>{item.displayName}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  searchContainer: {
    width: "100%",
    // paddingHorizontal:0,
    marginBottom: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  text: {
    fontSize: 20,
    marginRight: 10,
    textAlign: "center",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  contactItemSelected: {
    backgroundColor: "#e0e0e0",
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 20,
    marginRight: 10,
  },
});

export default ContactList;

const ContactListItem = ({ contact, toggleSelectContact }) => (
  <View style={styles.contactItem}>
    <TouchableOpacity
      onLongPress={() => toggleSelectContact(contact.recordID)}
      delayLongPress={300}
      style={styles.contactInfo}
    >
      <Text>{contact.displayName}</Text>
      {/* ...other contact info... */}
    </TouchableOpacity>
    <TouchableOpacity onPress={() => toggleSelectContact(contact.recordID)}>
      <Ionicons name="add-circle-outline" size={24} color="green" />
    </TouchableOpacity>
  </View>
);
