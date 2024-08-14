import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, PermissionsAndroid, TextInput, ScrollView, Image } from 'react-native';
import { launchImageLibrary, ImageLibraryOptions, Asset } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

// Import arrow icon
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigationProp, RouteProp, useNavigation } from '@react-navigation/native';
import { Appbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';

// Define the navigation stack parameter list
type RootStackParamList = {
  MechanicFunctions: undefined;
};

// Define the props for the Add component
type AddProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

// Define the type for image data
interface ImageData {
  assets: Asset[];
}

// Define the Add component with type annotations
const Add: React.FC<AddProps> = ({ navigation: any }) => {

  const navigation = useNavigation<NavigationProp<any>>();

  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [discountPrice, setDiscountPrice] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");

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
        },
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

    if (result.didCancel) {
      // Handle cancel
    } else if (result.assets) {
      console.log(result);
      setImageData({ assets: result.assets });
    }
  };

  const uploadImage = async () => {
    if (imageData && imageData.assets.length > 0) {
      const reference = storage().ref(imageData.assets[0].fileName!);
      const pathToFile = imageData.assets[0].uri!;
      // Upload file
      await reference.putFile(pathToFile);
      const url = await reference.getDownloadURL();
      console.log(url);
      uploadItem(url);
    } else if (imageUrl) {
      // If imageData is null, but imageUrl is provided, directly upload using imageUrl
      uploadItem(imageUrl);
    } else {
      console.log("No image data or URL provided");
    }
  };

  const uploadItem = async (url: string) => {
    const uid = await AsyncStorage.getItem('USERID')
    firestore().collection('items')
      .add({
        name: name,
        price: price,
        discountPrice: discountPrice,
        description: description,
        imageUrl: url,
        mecId: uid
      })
      .then(() => {
        console.log('Item added');
        navigation.navigate('Items');
        showMessage({
          message: "Spare part added.",
          type: 'success',
      })
      });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        {/* <TouchableOpacity
          onPress={() => navigation.navigate('MechanicFunctions')} // Navigate to MechanicFunctions
          style={styles.header}>
          <Image source={require('../../../../assets/img/SpareParts/arrow.png')} style={styles.arrowIcon} />
          <Text style={styles.headerText}>Add Spareparts</Text>
        </TouchableOpacity> */}
        <Appbar.Header style={{ backgroundColor: '#291D7D' }}>
          <Appbar.BackAction color='white' onPress={() => navigation.navigate('MechanicFunctions')} />
          <Appbar.Content title='Add Spareparts' color='white' style={{ alignItems: 'center', }} />
          <Appbar.Action icon={'cart'} color='#291D7D' />
        </Appbar.Header>
        {imageData !== null && imageData.assets[0] ? (
          <Image source={{ uri: imageData.assets[0].uri }} style={styles.imageStyle} />
        ) : null}
        <TextInput
          placeholder='Enter Item Name'
          style={styles.inputStyle}
          value={name}
          onChangeText={text => setName(text)}
        />
        <TextInput
          placeholder='Enter Item Price'
          style={styles.inputStyle}
          value={price}
          onChangeText={text => setPrice(text)}
          keyboardType="numeric"
        />
        <TextInput
          placeholder='Enter Item Discount Price'
          style={styles.inputStyle}
          value={discountPrice}
          onChangeText={text => setDiscountPrice(text)}
          keyboardType="numeric"
        />
        <TextInput
          placeholder='Enter Item Description'
          style={styles.inputStyle}
          value={description}
          onChangeText={text => setDescription(text)}
        />
        <TextInput
          placeholder='Enter Item Image url'
          style={styles.inputStyle}
          value={imageUrl}
          onChangeText={text => setImageUrl(text)}
        />
        <Text style={{ alignSelf: 'center', marginTop: 15 }}>OR</Text>
        <TouchableOpacity style={styles.pickBtn} onPress={requestCameraPermission}>
          <Text style={{color:'white'}}>Pick An Image From The Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.uploadBtn} onPress={uploadImage}>
          <Text style={{ color: 'white' }}>Upload Item</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Add;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#291D7D',
    padding: 15,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
  },
  arrowIcon: {
    width: 24,
    height: 24,
  },
  inputStyle: {
    width: '90%',
    height: 50,
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
    borderRadius: 10,
    borderWidth: 1.3,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#67676D'
  },
  uploadBtn: {
    backgroundColor: "#291D7D",
    height: 50,
    width: '90%',
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
    marginTop: 20,
  },
});
