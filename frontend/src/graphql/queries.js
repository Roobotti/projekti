import { gql } from "@apollo/client";

export const GET_REPOSITORIES = gql`
  query Repositories {
    repositories {
      edges {
        node {
          id
          fullName
          ratingAverage
          stargazersCount
          ownerAvatarUrl
          description
          language
          forksCount
          reviewCount
        }
      }
    }
  }
`;

export const GET_CURRENT_USER = gql`
  query Me {
    me {
      id
      username
    }
  }
`;
