/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createRos = /* GraphQL */ `
  mutation CreateRos(
    $input: CreateRosInput!
    $condition: ModelRosConditionInput
  ) {
    createRos(input: $input, condition: $condition) {
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
export const updateRos = /* GraphQL */ `
  mutation UpdateRos(
    $input: UpdateRosInput!
    $condition: ModelRosConditionInput
  ) {
    updateRos(input: $input, condition: $condition) {
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
export const deleteRos = /* GraphQL */ `
  mutation DeleteRos(
    $input: DeleteRosInput!
    $condition: ModelRosConditionInput
  ) {
    deleteRos(input: $input, condition: $condition) {
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
export const createChat = /* GraphQL */ `
  mutation CreateChat(
    $input: CreateChatInput!
    $condition: ModelChatConditionInput
  ) {
    createChat(input: $input, condition: $condition) {
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
export const updateChat = /* GraphQL */ `
  mutation UpdateChat(
    $input: UpdateChatInput!
    $condition: ModelChatConditionInput
  ) {
    updateChat(input: $input, condition: $condition) {
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
export const deleteChat = /* GraphQL */ `
  mutation DeleteChat(
    $input: DeleteChatInput!
    $condition: ModelChatConditionInput
  ) {
    deleteChat(input: $input, condition: $condition) {
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
export const createMember = /* GraphQL */ `
  mutation CreateMember(
    $input: CreateMemberInput!
    $condition: ModelMemberConditionInput
  ) {
    createMember(input: $input, condition: $condition) {
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
export const updateMember = /* GraphQL */ `
  mutation UpdateMember(
    $input: UpdateMemberInput!
    $condition: ModelMemberConditionInput
  ) {
    updateMember(input: $input, condition: $condition) {
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
export const deleteMember = /* GraphQL */ `
  mutation DeleteMember(
    $input: DeleteMemberInput!
    $condition: ModelMemberConditionInput
  ) {
    deleteMember(input: $input, condition: $condition) {
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
export const createRestaurant = /* GraphQL */ `
  mutation CreateRestaurant(
    $input: CreateRestaurantInput!
    $condition: ModelRestaurantConditionInput
  ) {
    createRestaurant(input: $input, condition: $condition) {
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
export const updateRestaurant = /* GraphQL */ `
  mutation UpdateRestaurant(
    $input: UpdateRestaurantInput!
    $condition: ModelRestaurantConditionInput
  ) {
    updateRestaurant(input: $input, condition: $condition) {
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
export const deleteRestaurant = /* GraphQL */ `
  mutation DeleteRestaurant(
    $input: DeleteRestaurantInput!
    $condition: ModelRestaurantConditionInput
  ) {
    deleteRestaurant(input: $input, condition: $condition) {
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
export const createPlace = /* GraphQL */ `
  mutation CreatePlace(
    $input: CreatePlaceInput!
    $condition: ModelPlaceConditionInput
  ) {
    createPlace(input: $input, condition: $condition) {
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
export const updatePlace = /* GraphQL */ `
  mutation UpdatePlace(
    $input: UpdatePlaceInput!
    $condition: ModelPlaceConditionInput
  ) {
    updatePlace(input: $input, condition: $condition) {
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
export const deletePlace = /* GraphQL */ `
  mutation DeletePlace(
    $input: DeletePlaceInput!
    $condition: ModelPlaceConditionInput
  ) {
    deletePlace(input: $input, condition: $condition) {
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
