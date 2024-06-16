import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, PermissionsAndroid, Image, ScrollView } from 'react-native';
import { launchImageLibrary, Asset, ImageLibraryOptions } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { useRoute, RouteProp, NavigationProp, useNavigation } from '@react-navigation/native';
import { Appbar } from 'react-native-paper';
import { showMessage } from 'react-native-flash-message';

type RootStackParamList = {
  EditItem: { id: string; data: { name: string; price: string; discountPrice: string; description: string; imageUrl: string } };
};

type EditItemRouteProp = RouteProp<RootStackParamList, 'EditItem'>;

interface ImageData {
  assets: Asset[];
}

const EditItem: React.FC = () => {
  const route = useRoute<EditItemRouteProp>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const initialData = route.params ? route.params.data : { name: '', price: '', discountPrice: '', description: '', imageUrl: '' };
  const [imageData, setImageData] = useState<ImageData>({
    assets: [{ uri: initialData.imageUrl, fileName: '' } as Asset],
  });
  const [name, setName] = useState(initialData.name);
  const [price, setPrice] = useState(initialData.price);
  const [discountPrice, setDiscountPrice] = useState(initialData.discountPrice);
  const [description, setDescription] = useState(initialData.description);
  const [imageUrl, setImageUrl] = useState(initialData.imageUrl);

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Cool Photo App Camera Permission',
          message: 'Cool Photo App needs access to your camera so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
        openGallery();
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const openGallery = async () => {
    const options: ImageLibraryOptions = { mediaType: 'photo' };
    const result = await launchImageLibrary(options);
    if (!result.didCancel && result.assets) {
      console.log(result);
      setImageData({ assets: result.assets });
    }
  };

  const uploadImage = async () => {
    try {
      const imageUri = imageData.assets[0].uri;
      if (imageUri && !imageUri.startsWith('http')) {
        const reference = storage().ref(imageData.assets[0].fileName || `images/${Date.now()}`);
        const pathToFile = imageUri;
        await reference.putFile(pathToFile);
        const url = await reference.getDownloadURL();
        console.log(url);
        uploadItem(url);
      } else {
        // If the image is a remote URL, use it directly without uploading
        uploadItem(imageUrl);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const uploadItem = async (url?: string) => {
    try {
      await firestore()
        .collection('items')
        .doc(route.params.id)
        .update({
          name: name,
          price: price,
          discountPrice: discountPrice,
          description: description,
          imageUrl: url || imageUrl, // Use the uploaded URL or the existing image URL
        });
      console.log('Item updated!');
      navigation.goBack(); // Navigating back to the previous screen
      showMessage({
        message: "Spare part updated.",
        type: 'success',
      })
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <Appbar.Header style={{ backgroundColor: '#291D7D' }}>
          <Appbar.BackAction color='white' onPress={() => navigation.goBack()} />
          <Appbar.Content title='Edit Item' color='white' style={{ alignItems: 'center' }} />
          <Appbar.Action icon={'cart'} color='#291D7D' />
        </Appbar.Header>

        {imageData.assets[0] && (
          <Image source={{ uri: imageData.assets[0].uri }} style={styles.imageStyle} />
        )}

        <TextInput
          placeholder="Enter Item Name"
          style={styles.inputStyle}
          value={name}
          onChangeText={text => setName(text)}
        />
        <TextInput
          placeholder="Enter Item Price"
          style={styles.inputStyle}
          value={price}
          onChangeText={text => setPrice(text)}
        />
        <TextInput
          placeholder="Enter Item Discount Price"
          style={styles.inputStyle}
          value={discountPrice}
          onChangeText={text => setDiscountPrice(text)}
        />
        <TextInput
          placeholder="Enter Item Description"
          style={styles.inputStyle}
          value={description}
          onChangeText={text => setDescription(text)}
        />
        <TextInput
          placeholder="Enter Item Image URL"
          style={styles.inputStyle}
          value={imageUrl}
          onChangeText={text => setImageUrl(text)}
        />
        <Text style={{ alignSelf: 'center', marginTop: 10 }}>OR</Text>
        <TouchableOpacity style={styles.pickBtn} onPress={() => requestCameraPermission()}>
          <Text style={{ color: '#FFF' }}>Pick Image From Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.uploadBtn} onPress={() => uploadImage()}>
          <Text style={{ color: '#FFF' }}>Upload Item</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputStyle: {
    width: '90%',
    height: 40,
    borderRadius: 10,
    borderWidth: 1.5,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 20,
    alignSelf: 'center',
  },
  pickBtn: {
    width: '90%',
    height: 50,
    borderWidth: 1.5,
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#67676D',
  },
  uploadBtn: {
    backgroundColor: '#291D7D',
    width: '90%',
    height: 50,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 70,
  },
  imageStyle: {
    width: '90%',
    height: 200,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 10,
  },
});

export default EditItem;
