import React,{Component, useState, useEffect} from 'react';
import { Animated, Text, View } from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
// import {isIphoneX} from 'react-native-iphone-x-helper';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import {requestNotifications} from 'react-native-permissions';

/**
 * 상단 상태바 높이 구하는 함수
 */
export const handleGetSafetyAreaHeight = () =>{
    return {
        height: getStatusBarHeight(true)
    };
}


/**
 * 푸시허용 얼럿 띄우기
 */
export const requestNotificationsFunc = () =>{
    requestNotifications(['alert', 'badge', 'sound', 'lockScreen']).then(({status, settings}) => {
        console.log('status', status);
        console.log('settings', settings);
      }).catch((error) => {
        console.log('error', error.message)
      });
}

/**
 * Firebase 연결
 */
export const registerAppWithFCM = ()=> {
    messaging().registerForRemoteNotifications();
}

/**
 * Firebase 권한요청
 */
export const requestPermission = () => {
    const granted = messaging().requestPermission();
    // const fcmToken = await messaging().getToken();
    // console.log('fcmToken', fcmToken);
   
    if (granted) {
      console.log('User granted messaging permissions!');
    } else {
      console.log('User declined messaging permissions :(');
    }
}
/**
 * Firebase 메시지 핸들러
 */
export const messageHandler = () =>{
    // useEffect(() => {
    //   const unsubscribe = messaging().onMessage(async remoteMessage => {
    //     console.log('FCM Message Data:', remoteMessage.data);
   
    //     // Update a users messages list using AsyncStorage
    //     const currentMessages = await AsyncStorage.getItem('messages');
    //     const messageArray = JSON.parse(currentMessages);
    //     messageArray.push(remoteMessage.data);
    //     await AsyncStorage.setItem('messages', JSON.stringify(messageArray));
    //   });
    // }, []);
  
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });
  }





  let webViewDom = null;

  /**
   * 웹뷰 통신 (웹뷰 => 네이티브)(데이터 이동방향)
   */
  export const onWebViewMsg = (event) =>{
      // console.log('nativeEventData', JSON.parse(event.nativeEvent.data));
  
      let msgData = JSON.parse(event.nativeEvent.data);
  
      switch(msgData.targetFunc){
        case 'goBack':
          console.log('뒤로가기');
          webViewDom.goBack();
          break;
        default:
          console.log('can not find func');
      }
      // this[msgData.targetFunc].apply(this, [msgData]);
  }
  
  /**
   * 웹뷰 통신 (네이티브 => 웹뷰)(데이터 이동방향)
   */
  export const sbgFunc = (msgData) =>{
      console.log('msgData', msgData);
      console.log('this.webViewDom', this.webViewDom);
      console.log(' this.webViewDom.postMessage 실행');
      this.webViewDom.postMessage(JSON.stringify(msgData), '*');
  }
  
  /**
   * 웹뷰의 DOM을 받아온다.
   */
  export const updateWebViewDom = (dom) =>{
    webViewDom = dom;
  }
  
  /**
   * 웹뷰 로딩바
   */
  export const ProgressBar = (props) =>{

    let endHeight = 5;
    let startWidth = '0%';
    let endWidth = '80%';
    let widthDuration = 5000;

    if(props.loadingFlag === false){
      endHeight = 0;
      startWidth = '80%';
      endWidth = '100%';
      widthDuration = 3000;
    }


    const [width] = useState(new Animated.Value(0));
    const [height] = useState(new Animated.Value(5));

    React.useEffect(() => {

      Animated.sequence([
        Animated.timing(
          width,
          {
            toValue: 100,
            duration: widthDuration,
          }
        ),
        Animated.timing(
          height,
          {
            toValue: endHeight,
            duration: 200,
          }
        )
      ]).start();


      // Animated.timing(
      //   width,
      //   {
      //     toValue: 100,
      //     duration: 5000,
      //   }
      // ).start();
    }, []);


    return (
      <Animated.View           
        style={{
          ...props.style,
          width: width.interpolate({
            inputRange: [0, 100],
            outputRange: [startWidth, endWidth]
          }),
          height: height    
        }}
      >
        {props.children}
      </Animated.View>
    );
  }

  // ProgressBar.defaultProps = {
  //   flexTarget: 0.8,
  //   heightTarget: 5
  // }