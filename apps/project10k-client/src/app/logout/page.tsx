"use client";
import { useRouter } from "next/navigation";
import { clearJwtToken } from "@/app/graphql";
import { useEffect } from "react";

export default function LogoutPage() {
    const router = useRouter();
    useEffect(() => {
        // Clear The Token
        clearJwtToken();
        // Clear Apollo Cache
        // resetApolloClientStore();
        // Redirect User To Workspaces Page
        router.push("/login");
    }, [router]);
    return null;
}
