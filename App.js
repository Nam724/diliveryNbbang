import Main from './src/screen/main';
import { Amplify } from 'aws-amplify';
import awsconfig from './src/aws-exports';

Amplify.configure(awsconfig);

export default function App(){
  return (
      <Main/>
  );
}