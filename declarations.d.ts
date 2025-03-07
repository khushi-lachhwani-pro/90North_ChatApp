declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.webp';
declare module '*.gif';

  
declare module '*.png' {
  import {ImageSourcePropType} from 'react-native';

  const value: ImageSourcePropType;
  export default value;
}

declare module '*.jpg' {
  import {ImageSourcePropType} from 'react-native';

  const value: ImageSourcePropType;
  export default value;
}
declare module '@env' {
    export const API_URL: string;
    export const API_KEY: string;
    export const API_URL_PAYMENT: string;
    export const API_URL_FEATURES: string;
    export const API_URL_SUPPORT : string
    export const SENTRY_AUTH_TOKEN : string
    // Add other environment variables here
  }

  declare module '*.svg' {
    import React from 'react';
    import {SvgProps} from 'react-native-svg';
  
    const content: React.FC<SvgProps>;
    export default content;
  }
  
declare module 'expo-media-library'
