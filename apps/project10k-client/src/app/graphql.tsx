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