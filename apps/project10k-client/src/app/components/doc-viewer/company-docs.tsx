import { useCallback, useState, ChangeEvent } from "react";
import { useQuery, gql } from "@apollo/client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@vspark/catalyst/table";
import { Heading } from "@vspark/catalyst/heading";
import { Loader } from "@vspark/catalyst/loader";
import { ICompaniesDocumentsQL } from "@/app/types/ql";

// Company Documents Query
const Q_COMPANY_DOCUMENTS = gql`
    query CompanyFilings($companyId: ID!) {
        companyFilings(companyId: $companyId) {
            _id
            form
            name
            period
            filedOn
            format
            location
        }
    }
`;

function DocumentsLoader() {
    return <Loader />;
}

export function CompanyDocuments() {
    // Company Documents Query
    const { loading, error, data } = useQuery<ICompaniesDocumentsQL>(Q_COMPANY_DOCUMENTS, {
        variables: { companyId: "66b281d563f0188007a263c0" },
    });

    if (loading || !data) {
        return <DocumentsLoader />;
    }

    console.log("company docs", data);

    return (
        <>
            <Heading>Financials</Heading>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableHeader>Name</TableHeader>
                        <TableHeader>Email</TableHeader>
                        <TableHeader>Role</TableHeader>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {/* {users.map((user) => (
                        <TableRow key={user.handle}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell className="text-zinc-500">{user.access}</TableCell>
                        </TableRow>
                    ))} */}
                </TableBody>
            </Table>
        </>
    );
}
