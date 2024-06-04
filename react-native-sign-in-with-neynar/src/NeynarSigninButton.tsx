import React, { ComponentProps, useState } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Linking,
  ViewStyle,
  TextStyle,
  Image,
  SafeAreaView,
  View,
} from "react-native";
import NeynarLogo from "./components/NeynarLogo";
import WebView, { WebViewMessageEvent } from "react-native-webview";
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
  fetchAuthorizationUrl: () => Promise<string>;
  successCallback: (data: ISuccessMessage) => void;
  errorCallback?: (error: any) => void;
  redirectUrl?: string;
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
  paddingVertical?: number;
  paddingHorizontal?: number;
  margin?: number;
  text?: string;
  color?: string;
  backgroundColor?: string;
  customLogoUrl?: string;
  logoSize?: string;
  buttonStyles?: ViewStyle;
  textStyles?: TextStyle;
  /*
    * The presentation style of the Modal exported by react-native. The default is "fullScreen".
    */
  presentationStyle?: ComponentProps<typeof Modal>["presentationStyle"];
}

export const NeynarSigninButton = ({
  fetchAuthorizationUrl,
  successCallback,
  errorCallback = () => {},
  redirectUrl,
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
  logoSize = "30",
  buttonStyles: customButtonStyle,
  textStyles: customTextStyle,
  presentationStyle,
}: IProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [authUrl, setAuthUrl] = useState<null | string>(null);

  const handleMessage = (event: WebViewMessageEvent) => {
    const data = JSON.parse(event.nativeEvent.data);
    successCallback(data);
    setModalVisible(false);
  };

  const handleOnPress = async () => {
    try {
      let authUrl = await fetchAuthorizationUrl();
      if (redirectUrl) {
        authUrl = `${authUrl}&deeplink_url=${encodeURIComponent(redirectUrl)}`;
      }
      setAuthUrl(authUrl);
      setModalVisible(true);
    } catch (error) {
      errorCallback(error);
    }
  };

  const getLogo = () => {
    try {
      if (Number.isNaN(parseInt(logoSize)))
        throw new Error("logoSize must be a number");
      switch (variant) {
        case Variant.NEYNAR:
          return <NeynarLogo height={logoSize} width={logoSize} />;
        case Variant.WARPCAST:
          return <WarpcastLogo height={logoSize} width={logoSize} />;
        case Variant.FARCASTER:
          return <FarcasterLogo height={logoSize} width={logoSize} />;
        default:
          return <NeynarLogo height={logoSize} width={logoSize} />;
      }
    } catch (err) {
      errorCallback(err);
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

  const getCustomLogo = () => {
    if (!customLogoUrl) return <></>;
    return <Image source={{ uri: customLogoUrl }} style={styles.customLogo} />;
  };

  const defaultButtonStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    height: height ?? 48,
    width: width ?? 218,
    borderRadius: borderRadius ?? 20,
    backgroundColor: backgroundColor
      ? backgroundColor
      : theme === Theme.DARK
      ? "#000000"
      : "#ffffff",
    paddingVertical: paddingVertical ?? 10,
    paddingHorizontal: paddingHorizontal ?? 20,
    margin: margin ?? 24,
  };

  const textStyle: TextStyle = {
    fontSize: fontSize ?? 16,
    fontWeight: fontWeight ?? "300",
    color: color ? color : theme === Theme.DARK ? "#ffffff" : "#000000",
    marginLeft: 10,
  };

  const combinedButtonStyle = StyleSheet.flatten([
    defaultButtonStyle,
    customButtonStyle,
  ]);

  const combinedTextStyle = StyleSheet.flatten([textStyle, customTextStyle]);

  return (
    <>
      <TouchableOpacity onPress={handleOnPress} style={combinedButtonStyle}>
        {!text ? getLogo() : getCustomLogo()}
        <Text style={combinedTextStyle}>{text || getButtonText()}</Text>
      </TouchableOpacity>
      {modalVisible && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          presentationStyle={presentationStyle}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <>
              <View style={styles.closeButtonContainer}>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>{"Close"}</Text>
                </TouchableOpacity>
              </View>
              {authUrl ? (
                <WebView
                  source={{
                    uri: authUrl,
                  }}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  scalesPageToFit={true}
                  startInLoadingState={true}
                  onMessage={handleMessage}
                  originWhitelist={["*"]}
                  onShouldStartLoadWithRequest={(event) => {
                    // For URLs that start with "https://warpcast.com", attempt to open them externally
                    if (event.url.startsWith("https://warpcast.com")) {
                      Linking.openURL(event.url).catch((err) =>
                        errorCallback(err)
                      );
                      return false; // Prevent WebView from loading this URL
                    }

                    // Allow URLs that start with "http://" or "https://"
                    if (event.url.match(/^(https:\/\/)|(http:\/\/)/)) {
                      return true; // Load these URLs within the WebView
                    }

                    // Attempt to open all other URLs (not starting with "http://" or "https://")
                    // in the device's default browser.
                    Linking.openURL(event.url).catch((err) =>
                      errorCallback(err)
                    );
                    return false; // Prevent WebView from loading these URLs
                  }}
                />
              ) : (
                <View>
                  <Text>{"authUrl is required"}</Text>
                </View>
              )}
            </>
          </SafeAreaView>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  customLogo: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  closeButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 10,
    paddingTop: 15,
  },
  closeButton: {
    borderWidth: 1,
    borderColor: "#8d69d1",
    borderRadius: 10,
    padding: 8,
    backgroundColor: "#fff",
  },
  closeButtonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#8d69d1",
  },
});
