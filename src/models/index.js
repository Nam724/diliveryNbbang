// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Chat, Member, Restaurant, Place } = initSchema(schema);

export {
  Chat,
  Member,
  Restaurant,
  Place
};