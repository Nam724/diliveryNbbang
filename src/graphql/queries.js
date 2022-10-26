/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getRos = /* GraphQL */ `
  query GetRos($id: ID!) {
    getRos(id: $id) {
      id
      posNum
      started
      arrived
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listRos = /* GraphQL */ `
  query ListRos($filter: ModelRosFilterInput, $limit: Int, $nextToken: String) {
    listRos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        posNum
        started
        arrived
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncRos = /* GraphQL */ `
  query SyncRos(
    $filter: ModelRosFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncRos(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        posNum
        started
        arrived
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getChat = /* GraphQL */ `
  query GetChat($id: ID!) {
    getChat(id: $id) {
      id
      message
      creatorID
      restaurantID
      creatorUsername
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listChats = /* GraphQL */ `
  query ListChats(
    $filter: ModelChatFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listChats(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        message
        creatorID
        restaurantID
        creatorUsername
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncChats = /* GraphQL */ `
  query SyncChats(
    $filter: ModelChatFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncChats(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        message
        creatorID
        restaurantID
        creatorUsername
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getMember = /* GraphQL */ `
  query GetMember($id: ID!) {
    getMember(id: $id) {
      id
      username
      email
      menu
      price
      phone_number
      restaurantID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listMembers = /* GraphQL */ `
  query ListMembers(
    $filter: ModelMemberFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMembers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        username
        email
        menu
        price
        phone_number
        restaurantID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncMembers = /* GraphQL */ `
  query SyncMembers(
    $filter: ModelMemberFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncMembers(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        username
        email
        menu
        price
        phone_number
        restaurantID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getRestaurant = /* GraphQL */ `
  query GetRestaurant($id: ID!) {
    getRestaurant(id: $id) {
      id
      name
      fee
      url
      makerID
      placeID
      Members_in_restaurant {
        items {
          id
          username
          email
          menu
          price
          phone_number
          restaurantID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      num_members
      account
      isFinishRecruiting
      Chats {
        items {
          id
          message
          creatorID
          restaurantID
          creatorUsername
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listRestaurants = /* GraphQL */ `
  query ListRestaurants(
    $filter: ModelRestaurantFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRestaurants(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        fee
        url
        makerID
        placeID
        Members_in_restaurant {
          nextToken
          startedAt
        }
        num_members
        account
        isFinishRecruiting
        Chats {
          nextToken
          startedAt
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncRestaurants = /* GraphQL */ `
  query SyncRestaurants(
    $filter: ModelRestaurantFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncRestaurants(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        name
        fee
        url
        makerID
        placeID
        Members_in_restaurant {
          nextToken
          startedAt
        }
        num_members
        account
        isFinishRecruiting
        Chats {
          nextToken
          startedAt
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getPlace = /* GraphQL */ `
  query GetPlace($id: ID!) {
    getPlace(id: $id) {
      id
      latitude
      longitude
      name
      Restaurants_in_a_place {
        items {
          id
          name
          fee
          url
          makerID
          placeID
          num_members
          account
          isFinishRecruiting
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      makerID
      num_restaurants
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listPlaces = /* GraphQL */ `
  query ListPlaces(
    $filter: ModelPlaceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPlaces(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        latitude
        longitude
        name
        Restaurants_in_a_place {
          nextToken
          startedAt
        }
        makerID
        num_restaurants
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncPlaces = /* GraphQL */ `
  query SyncPlaces(
    $filter: ModelPlaceFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncPlaces(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        latitude
        longitude
        name
        Restaurants_in_a_place {
          nextToken
          startedAt
        }
        makerID
        num_restaurants
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
