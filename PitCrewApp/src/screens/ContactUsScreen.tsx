import { StyleSheet, Text, View, Linking  } from 'react-native'
import React from 'react'
import { Icon } from '@rneui/base'

const ContactUsScreen = () => {
    return (
        <View style={styles.container} >

            <Text style={styles.headerText} >
                You can get in touch with us through below platforms. Our team will reach out to you as soon as it would be possible.
            </Text>

            <View style={styles.card}>
                <Text style={styles.cusSupText}>Customer Support</Text>
                <View style={styles.row}>
                    <View style={styles.cusSupIcon}>
                        <Icon name='phone' type='simple-line-icon' />
                    </View>
                    <View style={styles.column}>
                        <Text>Contact Number</Text>
                        <Text style={styles.contactText}>+94 710 404 738</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.cusSupIcon}>
                        <Icon name='mail-outline' type='ionicon' />
                    </View>
                    <View style={styles.column}>
                        <Text>Email Address</Text>
                        <Text style={styles.contactText}>help@pitcrew.com</Text>
                    </View>
                </View>
            </View>

            <View style={styles.card}>
                <Text style={styles.cusSupText}>Social Media</Text>
                <View style={styles.row}>
                <View style={[styles.socialIcon, {backgroundColor: '#E1306C'}]}>
                        <Icon name='instagram' type='antdesign' color={'white'} onPress={() => Linking.openURL('https://instagram.com')} />
                    </View>
                    <View style={styles.column}>
                        <Text>Instagram</Text>
                        <Text style={styles.contactText}>Instagram/PitCrew</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={[styles.socialIcon, {backgroundColor: '#1DA1F2'}]}>
                        <Icon name='twitter' type='antdesign' color={'white'} onPress={() => Linking.openURL('https://twitter.com')}/>
                    </View>
                    <View style={styles.column}>
                        <Text>Twitter</Text>
                        <Text style={styles.contactText}>Instagram/Twitter</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={[styles.socialIcon, {backgroundColor: '#4267B2'}]}>
                        <Icon name='facebook' type='font-awesome-5' color={'white'} onPress={() => Linking.openURL('https://facebook.com')} />
                    </View>
                    <View style={styles.column}>
                        <Text>Facebook</Text>
                        <Text style={styles.contactText}>Instagram/Facebook</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerText: {
        textAlign: 'center',
        marginVertical: '8%',
    },
    card: {
        backgroundColor: '#FFFFFF',
        width: '95%',
        alignSelf: 'center',
        borderRadius: 20,
        padding: 20,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        marginBottom: 20
    },
    cusSupText: {
        fontSize: 16,
        marginBottom: 20
    },
    row: {
        flexDirection: 'row',
        marginVertical: 10
    },
    cusSupIcon: {
        width: 45,
        height: 45,
        backgroundColor: '#e6e6e7',
        borderRadius: 100,
        justifyContent: 'center',
        marginRight: '5%'
    },
    column: {
        flex: 1,
        flexDirection: 'column'
    },
    contactText: {
        color: 'black',
        fontSize: 15,
        fontWeight: '600'
    },
    socialIcon: {
        width: 45,
        height: 45,
        borderRadius: 100,
        justifyContent: 'center',
        marginRight: '5%'
    },
})

export default ContactUsScreen