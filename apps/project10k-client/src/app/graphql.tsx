import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "http://localhost:3000/graphql",
    name: 'Project10k',
    version: '1.0'
});

export const ApolloAppProvider = ({ children }: { children: any }) => {
    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    );
};

export const MINDMAP_NODE_QL_RESPONSE = `
    mindMapNode {
        _id
        position {
            x, y
        }
        edges {
            _id
            target
        }
    }
`;

export const WORKSPACE_JOURNALS_QL_RESPONSE = `
    journals {
        _id
        name
        ${MINDMAP_NODE_QL_RESPONSE}
        journalEntry
    }
`;

export const WORKSPACE_QL_RESPONSE = `
    {
        _id,
        name
        ${WORKSPACE_JOURNALS_QL_RESPONSE}
    }
`;