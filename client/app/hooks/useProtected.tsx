import { redirect } from "next/navigation";
import { useSelector } from "react-redux";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";

interface ProtectedProps {
    children: React.ReactNode;
}

export default function Protected({ children }: ProtectedProps) {
    const { user } = useSelector((state: any) => state.auth);
    const { isLoading } = useLoadUserQuery();

    // If user is already in Redux state (e.g. just logged in), allow access immediately
    // without waiting for the loadUser query to complete.
    if (user) {
        return children;
    }

    // Still fetching session — don't redirect yet
    if (isLoading) {
        return null;
    }

    // Auth check complete, no user found — redirect to home
    redirect("/");
}