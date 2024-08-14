import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "http://localhost:3010/graphql",
    name: "Project10k",
    version: "1.0",
});

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
        embeddedOnJournalEntry
    }
`;

export const WORKSPACE_JOURNALS_QL_RESPONSE = `
    {
        _id
        name
        mindMapNode ${MINDMAP_NODE_QL_RESPONSE}
        citations {
            _id
            text
            range
            filing {
                _id
            }
            company {
                _id
            }
        }
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
        citations ${CITATIONS_QL_RESPONSE}
    }
`;

export const WORKSPACE_QL_RESPONSE = `
    {
        _id,
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
