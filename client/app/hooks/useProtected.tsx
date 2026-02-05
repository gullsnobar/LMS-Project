import { redirect } from "next/navigation";
import { useSelector } from "react-redux";
import userAuth from "./userAuth";

interface ProtectedProps {
    children: React.ReactNode;
}

export default function Protected({ children }: ProtectedProps) {
    const isAuthenticated = userAuth();
    const { user } = useSelector((state: any) => state.auth);
    if (!user) {
        redirect("/");
    }
    return children;
}