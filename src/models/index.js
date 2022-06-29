// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Member, Restaurant, Place } = initSchema(schema);

export {
  Member,
  Restaurant,
  Place
};