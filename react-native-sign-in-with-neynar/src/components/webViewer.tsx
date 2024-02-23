import { Platform } from 'react-native'
import WebView from 'react-native-webview'
import React from 'react'

export function WebViewer({ uri, onMessage, ...props }) {
  if (Platform.OS === 'web') {
    return (
      <iframe src={uri} style={{ width: '100%', height: '100%' }} {...props} />
    )
  } else {
    return <WebView source={{ uri }} onMessage={onMessage} {...props} />
  }
}
