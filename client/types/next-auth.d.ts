import "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id?: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            accessToken?: string;
            provider?: string;
            role?: string;
        };
    }

    interface User {
        id: string;
        role?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string;
        accessToken?: string;
        provider?: string;
        role?: string;
    }
}
