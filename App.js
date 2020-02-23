import React,{Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  ActivityIndicator
} from 'react-native';
// import ProgressWebView from 'react-native-progress-webview';
import {WebView} from 'react-native-webview';


import {
  handleGetSafetyAreaHeight,
  onWebViewMsg,
  registerAppWithFCM,
  requestPermission,
  messageHandler,
  requestNotificationsFunc,
  updateWebViewDom,
  ProgressBar
} from './src/utils';


class App extends Component{


  state = {
    loadingBarFlag : true
  }


  webViewDom = null;

  componentDidMount(){
    requestNotificationsFunc();
    registerAppWithFCM();
    requestPermission();
    messageHandler();

    updateWebViewDom(this.webViewDom);
  }

  // handeWebviewGoBack = () =>{
  //   this.webViewDom.goBack();
  // }
  

  handleLoadStart = () =>{
    this.setState({
      loadingBarFlag: true
    })
  }
  handleLoadEnd = () =>{
    this.setState({
      loadingBarFlag: false
    })
  }

  ActivityIndicatorLoadingView() {
    //making a view to show to while loading the webpage
    return (
      <ActivityIndicator
        color="#009688"
        size="large"
        style={styles.ActivityIndicatorStyle}
      />
    );
  }



  render(){


    return(
      <View style={styles.app__webviewWrapper}>
        <StatusBar barStyle="default" />
        <View style={handleGetSafetyAreaHeight()}></View>

        {this.state.loadingBarFlag && (
            <ProgressBar 
              loadingFlag={true}
              style={styles.app_progressBar} 
            />
          )
        }

        {this.state.loadingBarFlag || (
            <ProgressBar 
              loadingFlag={false}
              style={styles.app_progressBar} 
            />
          )
        }

        <WebView
          style={styles.app__webview}
          //Loading URL
          source={{ uri: 'http://goowoo.cafe24app.com' }}
          //Enable Javascript support
          javaScriptEnabled={true}
          //For the Cache
          domStorageEnabled={true}
          //Want to show the view or not

          // color="#501D5F"
          onLoadEnd = {this.handleLoadEnd}

          startInLoadingState={true}
          renderLoading={this.ActivityIndicatorLoadingView}

          onLoad={() => this.handleLoadEnd()}
          onLoadStart={() => this.handleLoadStart()}

          ref={ref => this.webViewDom = ref}
          onMessage={onWebViewMsg}
        />
      </View>
    )
  }
}


const styles = StyleSheet.create({

  app__webviewWrapper: {
    flex: 1
  },
  app__safeAreaView: {
    height: 40
  },


  app_progressBar: {
    backgroundColor: '#501D5F',
    // height: 5
  },


  app__webview: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    // marginTop: 40
  },
  app_backButton: {
    marginBottom: 50
  },

  ActivityIndicatorStyle: {
    height: '100%'
  },

});

export default App;
