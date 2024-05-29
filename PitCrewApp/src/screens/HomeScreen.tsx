import { View, Text, StatusBar, Image, ScrollView } from 'react-native'
import React from 'react'
import { Appbar, Drawer } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'

const HomeScreen = (navigation: any) => {


  return (
    <SafeAreaProvider>
      <View>

        {/* <Appbar.Header style={{ backgroundColor: '#11046E' }}>
          <Appbar.Action icon={'menu'} color='white' onPress={navigation.openDrawer()}/>
          <Appbar.Content title='PitCrew' color='white' style={{ alignItems: 'center', }} />
          <Appbar.Action icon={'cart'} color='white' />
        </Appbar.Header> */}

        <StatusBar backgroundColor={'#291D7D'} />

        <Text style={{
          color: '#11046E',
          fontFamily: 'Poppins-Medium',
          fontSize: 16,
          marginLeft: '5%',
          marginTop: '7%'
        }}>Recently added</Text>


        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', width: 600, paddingLeft: '5%' }}>
            <RecentlyAdded img={require('../../assets/img/SpareParts/steeringWheel.png')} title={'Steering wheel covers'} discount={'Upto 50% off'} price={'75 000'} />
            <RecentlyAdded img={require('../../assets/img/SpareParts/bulb.png')} title={'Light Bulbs'} discount={'Upto 25% off'} price={'10 000'} />
            <RecentlyAdded img={require('../../assets/img/SpareParts/knob.png')} title={'Steering wheel knobs'} discount={'Upto 30% off'} price={'5 000'} />
          </View>
        </ScrollView>

        <Text style={{
          color: '#11046E',
          fontFamily: 'Poppins-Medium',
          fontSize: 16,
          marginLeft: '5%',
          marginTop: '7%'
        }}>Popular Workshops
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', width: 700, paddingLeft: '4.5%' }}>
            <PopularWorkshops img={require('../../assets/img/WorkShops/ws1.png')} name={'Auto King Workshop'} place={'Muscat, Oman'} />
            <PopularWorkshops img={require('../../assets/img/WorkShops/ws2.png')} name={'Auto King Workshop'} place={'Muscat, Oman'} />
            <PopularWorkshops img={require('../../assets/img/WorkShops/ws3.png')} name={'Auto King Workshop'} place={'Muscat, Oman'} />
          </View>
        </ScrollView>


      </View>



    </SafeAreaProvider>
  )
}

function RecentlyAdded(p: any) {
  return (
    <View style={{ marginTop: '2%', flexDirection: 'column' }}>
      <View style={{ width: 170, height: 230, backgroundColor: '#FAFAFA', alignItems: 'center', marginRight: '2%' }}>
        <View style={{ marginTop: '5%' }}>
          <Image source={p.img} />
        </View>
        <View style={{ marginTop: '5%', alignItems: 'center' }}>
          <Text style={{ color: '#02010B', fontFamily: 'Poppins-Medium' }}>{p.title}</Text>
          <Text style={{ width: 100, height: 20, color: '#67676D', backgroundColor: '#E8E7E7', textAlign: 'center', fontFamily: 'Poppins-Medium' }}>{p.discount}</Text>
          <Text style={{ fontFamily: 'Poppins-SemiBold', color: '#ED1C24' }}>Rs.{p.price}</Text>
        </View>
        <View style={{ width: 170, height: 30, backgroundColor: '#291D7D', justifyContent: 'center' }}>
          <Text style={{ color: 'white', textAlign: 'center', fontFamily: 'Poppins-Medium', fontSize: 16 }}>ADD TO CART</Text>
        </View>
      </View>
    </View>
  );
}

function PopularWorkshops(p: any) {
  return (
    <View style={{ marginTop: '2%', flexDirection: 'column' }}>
      <View style={{ width: 200, height: 220, alignItems: 'center', marginRight: '2%', backgroundColor: 'red' }}>
        <Image source={p.img} style={{ width: 200, height: 160 }} />
        <View style={{ width: 200, height: 60, backgroundColor: '#291D7D', justifyContent: 'center' }}>
          <Text style={{ color: 'white', textAlign: 'center', fontFamily: 'Poppins-SemiBold', fontSize: 16 }}>{p.name}</Text>
          <Text style={{ color: '#67676D', textAlign: 'center', fontFamily: 'Poppins-Medium', fontSize: 16 }}>{p.place}</Text>
        </View>
      </View>
    </View>
  );
}




export default HomeScreen