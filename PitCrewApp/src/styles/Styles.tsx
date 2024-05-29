import { StyleSheet } from "react-native";

export const sty = StyleSheet.create({
    AppContainer: {
        flex: 1,
        backgroundColor: 'white'
    },

    SplashContainer: {
        flex: 1,
        backgroundColor: '#35343C',
        justifyContent:'center', 
        alignItems:'center'
    },

    WelcomeContainer: {
        flex: 1,
    },

    //Back Button
    BackIcon: {
        backgroundColor: '#B8B4D4', 
        borderRadius: 100, 
        width: 30, 
        height: 30, 
        marginLeft: '5%', 
        justifyContent: 'center',
        
    },

    BackWord: {
        paddingLeft: '1.5%',
        fontSize: 16,
        color: '#584F9A'
    },

    TextInputField: {
        justifyContent: 'center',
        borderColor: '#02010B',
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        height: 60,
        marginTop: '5%',
        marginHorizontal: '8%'

    },

    HeaderSignUp: {
        fontSize: 32, 
        fontFamily: 'Poppins-Bold', 
        fontWeight: '700', 
        color: '#02010B',
        marginLeft: '18%'
    }
})