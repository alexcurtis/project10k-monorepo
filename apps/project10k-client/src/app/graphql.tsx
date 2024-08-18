import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider, gql, createHttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

const httpLink = createHttpLink({
    uri: "http://localhost:3010/graphql",
});

export function setJwtToken(token: string) {
    return localStorage.setItem("jwtToken", token);
}

export function getJwtToken() {
    return localStorage.getItem("jwtToken");
}

export function clearJwtToken() {
    return localStorage.removeItem("jwtToken");
}

// JWT Authentication Link
const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = getJwtToken();
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    };
});

// JWT Authentication Error Link
const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (!graphQLErrors) {
        return;
    }
    // Find Any UnAuthorised Errors
    const unauthorised = graphQLErrors.find((qlError) => qlError.message === "Unauthorized");
    if (unauthorised) {
        // User Has An Unauthorised Session. Clear The Session and Login Again (All Done Via Logout)
        window.location.href = "/logout";
    }
});

const client = new ApolloClient({
    link: from([errorLink, authLink.concat(httpLink)]),
    cache: new InMemoryCache(),
    name: "Project10k",
    version: "1.0",
});

export function resetApolloClientStore() {
    client.resetStore();
}

export const ApolloAppProvider = ({ children }: { children: any }) => {
    return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export const COMPANY_FILING_QL_RESPONSE = `
    {
        _id
        form
        name
        period
        filedOn
        format
        path
        filename
    }
`;

export const MINDMAP_NODE_QL_RESPONSE = `
    {
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

export const CITATIONS_QL_RESPONSE = `
    {
        _id
        text
        range
        company {
            _id
            title
            ticker
        }
        filing {
            _id
            name
            period
            filedOn
        }
        updatedAt
        createdAt
    }
`;

export const WORKSPACE_JOURNALS_QL_RESPONSE = `
    {
        _id
        name
        mindMapNode ${MINDMAP_NODE_QL_RESPONSE}
    }
`;

export const JOURNAL_ENTRY_QL_RESPONSE = `
    {
        _id
        content
    }
`;

export const JOURNAL_FULLFAT_QL_RESPONSE = `
    {
        _id
        name
        mindMapNode ${MINDMAP_NODE_QL_RESPONSE}
        journalEntry ${JOURNAL_ENTRY_QL_RESPONSE}
    }
`;

export const WORKSPACE_QL_RESPONSE = `
    {
        _id
        name
        journals ${WORKSPACE_JOURNALS_QL_RESPONSE}
    }
`;

export const ACCOUNT_QL_RESPONSE = `
    {
        _id
        firstName
        lastName
        email
        workspaces {
            _id
            name
            updatedAt
            journals {
                _id
            }
        }
    }
`;

// Queries ----------------------------
export const Q_MY_ACCOUNT = gql`query getAccount {
    account(id: "66a6502936a423235f97625f") ${ACCOUNT_QL_RESPONSE}
}`;

// Mutators ---------------------------
export const M_CREATE_NEW_JOURNAL_ON_WORKSPACE = gql`mutation CreateNewJournalOnWorkspace($id: ID!) {
	createNewJournalOnWorkspace(id: $id)${WORKSPACE_QL_RESPONSE}
}
`;
