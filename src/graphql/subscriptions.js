/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateRos = /* GraphQL */ `
    subscription OnCreateRos {
        onCreateRos {
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
export const onUpdateRos = /* GraphQL */ `
    subscription OnUpdateRos($eq: ID) {
        onUpdateRos(filter: { id: { eq: $eq } }) {
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
export const onDeleteRos = /* GraphQL */ `
    subscription OnDeleteRos {
        onDeleteRos {
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
export const onCreateChat = /* GraphQL */ `
    subscription OnCreateChat {
        onCreateChat {
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
export const onUpdateChat = /* GraphQL */ `
    subscription OnUpdateChat {
        onUpdateChat {
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
export const onDeleteChat = /* GraphQL */ `
    subscription OnDeleteChat {
        onDeleteChat {
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
export const onCreateMember = /* GraphQL */ `
    subscription OnCreateMember {
        onCreateMember {
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
export const onUpdateMember = /* GraphQL */ `
    subscription OnUpdateMember {
        onUpdateMember {
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
export const onDeleteMember = /* GraphQL */ `
    subscription OnDeleteMember {
        onDeleteMember {
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
export const onCreateRestaurant = /* GraphQL */ `
    subscription OnCreateRestaurant {
        onCreateRestaurant {
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
export const onUpdateRestaurant = /* GraphQL */ `
    subscription onUpdateRestaurant($eq: ID) {
        onUpdateRestaurant(
            filter: { placeID: { eq: $eq } }
        ) {
            placeID
        }
    }
`;
export const onDeleteRestaurant = /* GraphQL */ `
    subscription OnDeleteRestaurant {
        onDeleteRestaurant {
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
export const onCreatePlace = /* GraphQL */ `
    subscription OnCreatePlace {
        onCreatePlace {
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
export const onUpdatePlace = /* GraphQL */ `
    subscription OnUpdatePlace {
        onUpdatePlace {
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
    subscription OnDeletePlace {
        onDeletePlace {
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
