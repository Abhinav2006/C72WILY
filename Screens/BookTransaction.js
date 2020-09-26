import React, {Component} from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Alert } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { TextInput } from 'react-native-gesture-handler';
import firebase from 'firebase';
import db from '../config';

export default class BookTransaction extends Component{
    constructor(){
        super();
        this.state = {
            hasCameraPermisions: null,
            scanned: false,
            scannedData: '',
            buttonState: 'normal',
            scannedBookID: "",
            scannedStudentID: "",
            transactionMessage: ""
        }
    }
    getCameraPermissions = async(ID)=>{
        const {status} = await Permissions.askAsync(Permissions.CAMERA)
        this.setState({hasCameraPermisions: status === "granted", buttonState: ID, scanned: false})
    }
    handleBarCodeScanned = async({type,data})=>{
        if (this.state.buttonState === "BookID"){
            this.setState({scanned: true, scannedBookID: data, buttonState: 'normal'})
        } else {
            this.setState({scanned: true, scannedStudentID: data, buttonState: 'normal'})
        }
    }
    handleTransaction = async()=>{
        console.log("work?")
        var transactionMessage
        db.collection("Books").doc(this.state.scannedBookID).get()
        .then((doc)=>{var book = doc.data()
        if(book.bookAvailability){
            this.initiateBookIssue()
            transactionMessage = "Book Issued"
        }else{
            this.initiateBookReturn()
            transactionMessage = "Book Returned"
        }
    })
    this.setState({transactionMessage:transactionMessage})
    }

    initiateBookIssue = async()=>{
        console.log("issue")
        db.collection("Transactions").add({
            'studentID': this.state.scannedStudentID,
            'bookID': this.state.scannedBookID,
            'date': firebase.firestore.Timestamp.now().toDate(),
            'transactionType': 'issue'
        })
        db.collection("Books").doc(
            this.state.scannedBookID).update({'bookAvailability':false})
        db.collection("Students").doc(
            this.state.scannedStudentID).update({'booksIssued':firebase.firestore.FieldValue.increment(1)})
            this.setState({scannedBookID:'',scannedStudentID:''})
            Alert.alert("Book issued successfully")
    }

    initiateBookReturn = async()=>{
        db.collection("Transactions").add({
            'studentID': this.state.scannedStudentID,
            'bookID': this.state.scannedBookID,
            'date': firebase.firestore.Timestamp.now().toDate(),
            'transactionType': 'return'
        })
        db.collection("Books").doc(
            this.state.scannedBookID).update({'bookAvailability':true})
        db.collection("Students").doc(
            this.state.scannedStudentID).update({'booksIssued':firebase.firestore.FieldValue.increment(-1)})
            this.setState({scannedBookID:'',scannedStudentID:''})
            Alert.alert("Book returned successfully")
    }

    render(){
        const hasCameraPermisions = this.state.hasCameraPermisions
        const scanned = this.state.scanned
        const buttonState = this.state.buttonState
        if(buttonState === 'clicked' && hasCameraPermisions){
        return(
            <BarCodeScanner onBarCodeScanned = {scanned?undefined: this.handleBarCodeScanned}
            style = {StyleSheet.absoluteFillObject}/>
        )
    }else if (buttonState === 'normal'){
        return(
            <KeyboardAvoidingView style = {{flex: 1, justifyContent:'center', alignItems: 'center'}} behavior = "padding" enabled>
            <View>
            <Text style = {{fontSize: 15, textDecorationLine: 'underline'}}></Text>
            <View>
            <Image source = {require("../assets/booklogo.jpg")} style = {{width:200, height:200}}/>
            <Text style = {{alignSelf: 'center', fontSize: 30}}>WILY</Text>
            </View>
            <View>
            <TextInput style = {styles.InputBox} placeholder = "Book ID" onChangeText = {text=>this.setState({scannedBookID:text})} value = {this.state.scannedBookID}></TextInput>
            <TouchableOpacity style = {{color: 'blue', width: 50, height: 30}} onPress = {()=>{this.getCameraPermissions("BookID")}}><Text>Scan</Text></TouchableOpacity>
            <TextInput style = {styles.InputBox} placeholder = "Student ID" onChangeText = {text=>this.setState({scannedStudentID:text})} value = {this.state.scannedStudentID}></TextInput>
            <TouchableOpacity style = {{color: 'red', width: 50, height: 30}} onPress = {()=>{this.getCameraPermissions("StudentID")}}><Text>Scan</Text></TouchableOpacity>
            <TouchableOpacity style = {styles.button} onPress = {()=>{this.handleTransaction()}}><Text>Submit</Text></TouchableOpacity>
            </View>
            </View>
            </KeyboardAvoidingView>
        )
    }
    }
}

const styles = StyleSheet.create({
    InputBox:{
        borderWidth: 2,
        width: '70%',
        height: 30
    },
    button:{
        width: 50,
        height: 25,
        marginTop: 40,
        textAlign: 'center'
    }
})