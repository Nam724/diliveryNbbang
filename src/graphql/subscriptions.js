/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateMember = /* GraphQL */ `
    subscription OnCreateMember(
        $filter: ModelSubscriptionMemberFilterInput
    ) {
        onCreateMember(filter: $filter) {
            id
            username
            email
            menu
            price
            restaurantID
            phone_number
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
        }
    }
`;
export const onUpdateMember = /* GraphQL */ `
    subscription OnUpdateMember(
        $filter: ModelSubscriptionMemberFilterInput
    ) {
        onUpdateMember(filter: $filter) {
            id
            username
            email
            menu
            price
            restaurantID
            phone_number
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
        }
    }
`;
export const onDeleteMember = /* GraphQL */ `
    subscription OnDeleteMember(
        $filter: ModelSubscriptionMemberFilterInput
    ) {
        onDeleteMember(filter: $filter) {
            id
            username
            email
            menu
            price
            restaurantID
            phone_number
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
        }
    }
`;
export const onCreateRestaurant = /* GraphQL */ `
    subscription OnCreateRestaurant(
        $filter: ModelSubscriptionRestaurantFilterInput
    ) {
        onCreateRestaurant(filter: $filter) {
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
                    restaurantID
                    phone_number
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
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
        }
    }
`;
export const onUpdateRestaurant = /* GraphQL */ `
    subscription OnUpdateRestaurant(
        $filter: ModelSubscriptionRestaurantFilterInput
    ) {
        onUpdateRestaurant(filter: $filter) {
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
                    restaurantID
                    phone_number
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
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
        }
    }
`;
export const onDeleteRestaurant = /* GraphQL */ `
    subscription OnDeleteRestaurant(
        $filter: ModelSubscriptionRestaurantFilterInput
    ) {
        onDeleteRestaurant(filter: $filter) {
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
                    restaurantID
                    phone_number
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
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
        }
    }
`;
export const onCreatePlace = /* GraphQL */ `
    subscription OnCreatePlace {
        onCreatePlace {
            createdAt
            id
            latitude
            longitude
            makerID
            name
            num_restaurants
            updatedAt
        }
    }
`;
export const onUpdatePlace = /* GraphQL */ `
    subscription OnUpdatePlace(
        $filter: ModelSubscriptionPlaceFilterInput
    ) {
        onUpdatePlace(filter: $filter) {
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
export const onDeletePlace = /* GraphQL */ `
    subscription OnDeletePlace(
        $filter: ModelSubscriptionPlaceFilterInput
    ) {
        onDeletePlace(filter: $filter) {
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
