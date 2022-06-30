import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type MemberMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type RestaurantMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type PlaceMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Member {
  readonly id: string;
  readonly username?: string | null;
  readonly email?: string | null;
  readonly menu_fee_array?: (string | null)[] | null;
  readonly restaurantID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Member, MemberMetaData>);
  static copyOf(source: Member, mutator: (draft: MutableModel<Member, MemberMetaData>) => MutableModel<Member, MemberMetaData> | void): Member;
}

export declare class Restaurant {
  readonly id: string;
  readonly name?: string | null;
  readonly fee?: number | null;
  readonly url?: string | null;
  readonly makerID?: string | null;
  readonly placeID: string;
  readonly Members_in_restaurant?: (Member | null)[] | null;
  readonly num_members?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Restaurant, RestaurantMetaData>);
  static copyOf(source: Restaurant, mutator: (draft: MutableModel<Restaurant, RestaurantMetaData>) => MutableModel<Restaurant, RestaurantMetaData> | void): Restaurant;
}

export declare class Place {
  readonly id: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly name: string;
  readonly Restaurants_in_a_place?: (Restaurant | null)[] | null;
  readonly makerID?: string | null;
  readonly num_restaurants?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Place, PlaceMetaData>);
  static copyOf(source: Place, mutator: (draft: MutableModel<Place, PlaceMetaData>) => MutableModel<Place, PlaceMetaData> | void): Place;
}