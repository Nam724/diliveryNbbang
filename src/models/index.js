// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Ros, Chat, Member, Restaurant, Place } = initSchema(schema);

export {
  Ros,
  Chat,
  Member,
  Restaurant,
  Place
};