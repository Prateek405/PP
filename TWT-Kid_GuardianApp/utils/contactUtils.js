import Contacts from 'react-native-contacts';
import { PermissionsAndroid } from 'react-native';

export const requestContactPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        title: 'Contact Permission',
        message: 'This app needs access to your contacts.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (error) {
    console.warn(error);
    return false;
  }
};

export const fetchContacts = async () => {
  try {
    return await Contacts.getAll();
  } catch (error) {
    console.warn(error);
    return [];
  }
};
