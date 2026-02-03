"use client";

import Verification from "../components/Auth/Verification";
import { useRouter } from "next/navigation";

export default function VerificationPage() {
    const router = useRouter();

    const handleSetRoute = (route: "Login" | "Sign-Up" | "Verification") => {
        if (route === "Login") {
            router.push("/login");
        } else if (route === "Sign-Up") {
            router.push("/signup");
        }
    };

    const handleSetOpen = (open: boolean) => {
        // Not used in page mode
    };

    return (
        <Verification
            setRoute={handleSetRoute}
            setOpen={handleSetOpen}
            isPage={true}
        />
    );
}
