/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Video from 'react-native-video';
import RNFetchBlob from 'react-native-fetch-blob'

const App: () => React$Node = () => {

  const [vidRef, setVidRef] = useState(null);
  const [vidStats, setVidStats] = useState({});
  const [streamProgress, setStreamProgress] = useState({ isStreaming: false, isDoneStreaming: false });

  const PATH_TO_WRITE = RNFetchBlob.fs.dirs.DocumentDir + '/stream.mov'

  const vidUrl = "https://www.radiantmediaplayer.com/media/big-buck-bunny-360p.mp4";

  useEffect(() => {
    RNFetchBlob.fs.createFile(PATH_TO_WRITE)
      .then(() => console.log('file created!'))
      .catch(e => console.log('error creating file: ', e))
  }, [])

  // console.log('RNFetchBlob: ', RNFetchBlob.fs.dirs)

  // console.log('path to write: ', PATH_TO_WRITE)

  const streamFile = async () => {
    setStreamProgress({ ...streamProgress, isStreaming: true })
    RNFetchBlob.fetch('GET', vidUrl)
      .then(res => {
        console.log('Object.keys(res): ', Object.keys(res))
        return res.data;
      })
      .then(base64 => {
        RNFetchBlob.fs.writeStream(PATH_TO_WRITE, 'base64')
          .then((stream) => {
            console.log('stream: ', stream)
            stream.write(base64)
              .then(done => {
                console.log('written: ', done)
                RNFetchBlob.fs.stat(PATH_TO_WRITE)
                  .then((stats) => {
                    console.log('stats line 61: ', stats)
                    setStreamProgress({ isStreaming: false, isDoneStreaming: true });
                    return stream.close()
                  })
                  .catch((err) => {
                    console.log('error line 62: ', err)
                    return stream.close()
                  })
              })
              .catch(e => console.log('error writing to writeStream: ', e))
          })
          .catch(e => console.log('error creating writeStream: ', e))
      })
      .catch(e => console.log('error fetching: ', e))
  }

  const handlePlay = () => {
    console.log('play here')
  }

  console.log('PATH_TO_WRITE: ', 'file://' + PATH_TO_WRITE)

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {/* <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}> */}
        {
          !streamProgress.isDoneStreaming ? (
            <TouchableOpacity onPress={streamFile}>
              <Text>{!streamProgress.isStreaming ? 'Stream!' : 'Streaming...'}</Text>
            </TouchableOpacity>
          ) : (
              <TouchableOpacity onPress={handlePlay}>
                <Text>Play!</Text>
              </TouchableOpacity>
            )
        }
        {/* {
            streamProgress.isStreaming || streamProgress.isDoneStreaming && */}
        <Video
          source={{ uri: PATH_TO_WRITE }}   // Can be a URL or a local file.
          ref={(ref) => setVidRef(ref)}                                      // Store reference
          //  onBuffer={this.onBuffer}                // Callback when remote video is buffering
          //  onError={this.videoError}               // Callback when video cannot be loaded
          style={{ width: '100%', height: '100%' }}
        // controls
        />
        {/* } */}
        {/* </View> */}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
