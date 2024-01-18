import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Linking,
  ViewStyle,
  TextStyle,
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

export enum Theme {
  DARK = "dark",
  LIGHT = "light",
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
  theme?: Theme;
  variant?: Variant;
  height?: number;
  width?: number;
  borderRadius?: number;
  fontSize?: number;
  fontWeight?:
    | "300"
    | "normal"
    | "bold"
    | "100"
    | "200"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900"
    | undefined;
  paddingVertical: number;
  paddingHorizontal: number;
  margin?: number;
  text?: string;
  color?: string;
  backgroundColor?: string;
  customLogoUrl?: string;
  logoSize?: number;
  styles?: ViewStyle;
}

export const NeynarSigninButton = ({
  apiKey,
  clientId,
  successCallback,
  errorCallback = () => {},
  theme = Theme.LIGHT,
  variant = Variant.NEYNAR,
  height,
  width,
  borderRadius,
  fontSize,
  fontWeight,
  paddingVertical,
  paddingHorizontal,
  margin,
  text,
  color,
  backgroundColor,
  customLogoUrl,
  logoSize,
  styles: customButtonStyle,
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

  const themeBasedStyles =
    theme === Theme.DARK ? darkThemeStyles : lightThemeStyles;

  const defaultButtonStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    minWidth: 218,
    height: height ?? 48,
    width: width ?? 218,
    borderRadius: borderRadius ?? 20,
    backgroundColor: backgroundColor ?? "#fff",
    paddingVertical: paddingVertical ?? 10,
    paddingHorizontal: paddingHorizontal ?? 20,
    margin: margin ?? 24,
  };

  const textStyle: TextStyle = {
    fontSize: fontSize ?? 16,
    fontWeight: fontWeight ?? "300",
    color: color ?? "#000",
    marginLeft: 10,
  };

  const combinedButtonStyle = StyleSheet.flatten([
    defaultButtonStyle,
    customButtonStyle,
    themeBasedStyles.button,
  ]);

  const combinedTextStyle = StyleSheet.flatten([
    textStyle,
    themeBasedStyles.text,
  ]);

  return (
    <>
      <TouchableOpacity onPress={handleOnPress} style={combinedButtonStyle}>
        {getLogo()}
        <Text style={combinedTextStyle}>{text || getButtonText()}</Text>
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

const darkThemeStyles = StyleSheet.create({
  button: {
    backgroundColor: "#000",
  },
  text: {
    color: "#fff",
  },
});

const lightThemeStyles = StyleSheet.create({
  button: {
    backgroundColor: "#fff",
  },
  text: {
    color: "#000",
  },
});
