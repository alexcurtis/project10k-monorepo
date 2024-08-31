import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider, gql, createHttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import toast from "react-hot-toast";

import { ErrorToast } from "@vspark/catalyst/toast";

const OPERATION_ERRORS_TO_IGNORE = ["Login"];

const httpLink = createHttpLink({
    uri: "/graphql",
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
const errorLink = onError(({ graphQLErrors, networkError, operation, response }) => {
    if (graphQLErrors) {
        // Find Any UnAuthorised Errors
        const unauthorised = graphQLErrors.find((qlError) => qlError.message === "Unauthorized");
        if (unauthorised) {
            // User Has An Unauthorised Session. Clear The Session and Login Again (All Done Via Logout)
            window.location.href = "/logout";
            return;
        }
    }
    // Ignore Certain Errors (These Will Be Handled Else Where - Like Login Page)
    const { operationName } = operation;
    if (OPERATION_ERRORS_TO_IGNORE.includes(operationName)) {
        return;
    }
    // Any Other Errors Drop To A Toast Notification
    toast.custom(
        (t) => (
            <ErrorToast
                id={t.id}
                message="An error occured when trying to talk to the server. Please try the action again."
                duration={t.duration}
                visible={t.visible}
            />
        ),
        {
            duration: 4000,
        }
    );
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

// GraphQL Reponses------------------------------------

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
        name
        workspaces {
            _id
            account {
                _id
            }
            name
            updatedAt
            journals {
                _id
            }
        }
        checklists {
            _id
            name
            children {
                _id
            }
        }
    }
`;

export const USER_QL_RESPONSE = `
    {
        _id
        firstName
        lastName
        email
    }
`;

export const LOGIN_QL_RESPONSE = `
    {
        token
        user {
            account {
                _id
            }
        }
    }
`;

export const CHECKLIST_QL_RESPONSE = `
    {
        _id
        account {
            _id
        }
        name
        parent
        children {
            _id
        }
        question
        formula
        why
        textual
        metric
        scale {
            danger
            fail
            pass
            amazing
        }
    }
`;

// Queries -----------------------------------------
export const Q_MY_ACCOUNT = gql`query getAccount($id: ID!) {
    account(id: $id) ${ACCOUNT_QL_RESPONSE}
    me ${USER_QL_RESPONSE}
}`;

export const Q_CHECKLIST = gql`
    query getCheckList($id: ID!) {
        checklist(id: $id) ${CHECKLIST_QL_RESPONSE}
    }
`;

export const Q_MY_CHECKLISTS = gql`
    query getCheckLists($accountId: ID!) {
        checklists(accountId: $accountId) ${CHECKLIST_QL_RESPONSE}
    }
`;

// Mutators -----------------------------------------
export const M_CREATE_NEW_JOURNAL_ON_WORKSPACE = gql`mutation CreateNewJournalOnWorkspace($id: ID!) {
	createNewJournalOnWorkspace(id: $id)${WORKSPACE_QL_RESPONSE}
}
`;
