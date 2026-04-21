import { WebView } from 'react-native-webview';

export default function Home() {
  return (
    <WebView source={{ uri: '__WEBVIEW_URL__' }} />
  );
}
