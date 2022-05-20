// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Restaurant, Place } = initSchema(schema);

export {
  Restaurant,
  Place
};