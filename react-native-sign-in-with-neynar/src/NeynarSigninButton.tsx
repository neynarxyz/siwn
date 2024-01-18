import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Linking,
} from "react-native";
import NeynarLogo from "./components/NeynarLogo";
import WebView, {
  WebViewMessageEvent,
  WebViewNavigation,
} from "react-native-webview";
import WarpcastLogo from "./components/WarpcastLogo";
import FarcasterLogo from "./components/FarcasterLogo";

export interface ISuccessMessage {
  fid: string;
  is_authenticated: boolean;
  signer_uuid: string;
}

export enum Variant {
  NEYNAR = "neynar",
  WARPCAST = "warpcast",
  FARCASTER = "farcaster",
}

enum ButtonText {
  NEYNAR = "Sign in with Neynar",
  WARPCAST = "Connect Warpcast",
  FARCASTER = "Connect Farcaster",
}

interface IProps {
  apiKey: string;
  clientId: string;
  successCallback: (data: ISuccessMessage) => void;
  errorCallback?: (error: any) => void;
  variant?: Variant;
}

export const NeynarSigninButton = ({
  apiKey,
  clientId,
  successCallback,
  errorCallback = () => {},
  variant = Variant.NEYNAR,
}: IProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [authUrl, setAuthUrl] = useState<string | null>(null);

  const handleMessage = (event: WebViewMessageEvent) => {
    const data = JSON.parse(event.nativeEvent.data);
    successCallback(data);
    setModalVisible(false);
  };

  const handleOnPress = async () => {
    try {
      const response = await fetch(
        `https://api.neynar.com/v2/farcaster/login/authorize?api_key=${apiKey}&response_type=code&client_id=${clientId}`
      );

      if (!response.ok) throw new Error("Something went wrong");

      const json = await response.json();
      setAuthUrl(json.authorization_url);
      setModalVisible(true);
    } catch (err) {
      errorCallback(err);
      setModalVisible(false);
    }
  };

  const getLogo = () => {
    switch (variant) {
      case Variant.NEYNAR:
        return <NeynarLogo />;
      case Variant.WARPCAST:
        return <WarpcastLogo />;
      case Variant.FARCASTER:
        return <FarcasterLogo />;
      default:
        return <NeynarLogo />;
    }
  };

  const getButtonText = () => {
    switch (variant) {
      case Variant.NEYNAR:
        return ButtonText.NEYNAR;
      case Variant.WARPCAST:
        return ButtonText.WARPCAST;
      case Variant.FARCASTER:
        return ButtonText.FARCASTER;
      default:
        return ButtonText.NEYNAR;
    }
  };

  return (
    <>
      <TouchableOpacity onPress={handleOnPress} style={styles.signInButton}>
        {getLogo()}
        <Text style={styles.signInText}>{getButtonText()}</Text>
      </TouchableOpacity>
      {modalVisible && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          {authUrl && (
            <WebView
              source={{
                uri: authUrl,
              }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              scalesPageToFit={true}
              startInLoadingState={true}
              onNavigationStateChange={(navState: WebViewNavigation) =>
                console.log(navState)
              }
              onMessage={handleMessage}
              originWhitelist={["*"]}
              onShouldStartLoadWithRequest={(event) => {
                if (event.url.match(/(https:\/\/)|(http:\/\/)/)) {
                  return true;
                }
                Linking.openURL(event.url).catch((err) =>
                  console.error("MP: An error occurred", err)
                );
                return false;
              }}
            />
          )}
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  signInButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 24,
    minWidth: 218,
    width: 218,
  },
  signInText: { fontSize: 16, fontWeight: "300", marginLeft: 10 },
});
