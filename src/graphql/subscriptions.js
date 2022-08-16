/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateMember = /* GraphQL */ `
    subscription OnCreateMember {
        onCreateMember {
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
    subscription OnUpdateMember {
        onUpdateMember {
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
    subscription OnDeleteMember {
        onDeleteMember {
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

export const onCreateRestaurant = (id) => /* GraphQL */ `
    subscription onCreateRestaurant($eq: ID = "${id}") {
        onCreateRestaurant(
            filter: { placeID: { eq: $eq } }
        ) {
            placeID
            name
        }
    }
`;
export const onUpdateRestaurant = /* GraphQL */ `
    subscription onUpdateRestaurant($eq: ID) {
        onUpdateRestaurant(
            filter: { placeID: { eq: $eq } }
        ) {
            placeID
            name
        }
    }
`;
export const onDeleteRestaurant = /* GraphQL */ `
    subscription onDeleteRestaurant($eq: ID) {
        onDeleteRestaurant(
            filter: { placeID: { eq: $eq } }
        ) {
            placeID
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
    subscription OnUpdatePlace {
        onUpdatePlace {
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
export const onDeletePlace = /* GraphQL */ `
    subscription OnDeletePlace {
        onDeletePlace {
            id
            latitude
            longitude
            name
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
