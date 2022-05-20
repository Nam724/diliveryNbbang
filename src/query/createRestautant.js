import { DataStore } from '@aws-amplify/datastore';
import { Restaurant } from '../models';

await DataStore.save(
    new Restaurant({
		"name": "Lorem ipsum dolor sit amet",
		"fee": 1020,
		"url": "Lorem ipsum dolor sit amet",
		"placeID": "a3f4095e-39de-43d2-baf4-f8c16f0f6f4d"
	})
);