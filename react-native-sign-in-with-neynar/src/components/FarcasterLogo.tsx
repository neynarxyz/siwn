import React from "react";
import Svg, { Path, Rect } from "react-native-svg";

interface Props {
  width?: string;
  height?: string;
  style?: React.CSSProperties;
}

const FarcasterLogo = ({ width = "30", height = "30" }: Props) => (
  <Svg width={width} height={height} viewBox="0 0 225 225" fill="none">
    <Rect width="225" height="225" rx="50" fill="#855DCD" />
    <Path
      d="M58 35H167V190H151V119H150.843C149.075 99.3773 132.583 84 112.5 84C92.4169 84 75.9253 99.3773 74.157 119H74V190H58V35Z"
      fill="white"
    />
    <Path
      d="M29 57L35.5 79H41V168C38.2386 168 36 170.239 36 173V179H35C32.2386 179 30 181.239 30 184V190H86V184C86 181.239 83.7614 179 81 179H80V173C80 170.239 77.7614 168 75 168H69V57H29Z"
      fill="white"
    />
    <Path
      d="M152 168C149.239 168 147 170.239 147 173V179H146C143.239 179 141 181.239 141 184V190H197V184C197 181.239 194.761 179 192 179H191V173C191 170.239 188.761 168 186 168V79H191.5L198 57H158V168H152Z"
      fill="white"
    />
  </Svg>
);

export default FarcasterLogo;