export interface LoginCredentials {
    email: string;
    password: string
}

export interface SignupCredentials {
    name: string;
    username: string;
    email: string;
    password: string
}

export interface AuthResponse {
    message: string;
    token?: string;
    user?: {
        id: string;
        name: string;
        email: string;
        username: string
    }
}