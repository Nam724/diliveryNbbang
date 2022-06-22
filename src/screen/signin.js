import { withAuthenticator, Button, Heading } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

/* src/App.js */
function App({ signOut, user }) {
  // Todo logic here

  return (
    <View>
      {/* Add Todo JSX here  */}
      <Heading level={1}>Hello {user.username}</Heading>
      <Button onClick={signOut}>Sign out</Button>
    </View>
  );
}

export default withAuthenticator(App);