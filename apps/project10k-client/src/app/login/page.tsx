"use client";

import { FormEvent, useCallback, useState } from "react";
import Image from "next/image";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";

import { Button } from "@vspark/catalyst/button";
import { Input } from "@vspark/catalyst/input";

import { ApolloAppProvider, LOGIN_QL_RESPONSE, setJwtToken } from "@platform/graphql";
import { IUser } from "@platform//types/entities";

// Login Mutation
const M_LOGIN = gql`
    mutation Login($login: InputLoginDto!) {
        login(login: $login) ${LOGIN_QL_RESPONSE}
    }
`;

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Login Mutator
    const [login, {}] = useMutation(M_LOGIN);

    const router = useRouter();
    const onSubmitCb = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            login({
                variables: { login: { email, password } },
                onCompleted: ({ login }: { login: { user: IUser; token: string } }) => {
                    // Store The Token
                    setJwtToken(login.token);
                    // Redirect User To Workspaces Page
                    router.push(`/platform/${login.user.account._id}/workspaces`);
                },
            });
            event.preventDefault();
        },
        [router, login, email, password]
    );

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    {/* <Image
                        width={100}
                        height={100}
                        alt="Your Company"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                        className="mx-auto"
                    /> */}
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
                        Sign in to your Project10k account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={onSubmitCb} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                                Email address
                            </label>
                            <div className="mt-2">
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={email}
                                    autoFocus
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                                    Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <Button color="indigo" type="submit" className="w-full">
                                Sign in
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default function LoginPage() {
    return (
        <ApolloAppProvider>
            <LoginForm />
        </ApolloAppProvider>
    );
}
