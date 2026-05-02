export type Stack = "backend" | "frontend";

export type Level = "debug" | "info" | "warn" | "error" | "fatal";

export type BackendPackage = "cache" | "controller" | "cron_job" | "db" | "domain" | "handler" | "repository" | "route" | "service";
export type FrontendPackage = "api" | "component" | "hook" | "page" | "state" | "style";
export type CommonPackage = "auth" | "config" | "middleware" | "utils";

export type Package = BackendPackage | FrontendPackage | CommonPackage;

// credentials needed for auth
export interface AuthCredentials {
    email: string;
    name: string;
    rollNo: string;
    accessCode: string;
    clientID: string;
    clientSecret: string;
}

export interface AuthTokenResponse {
    token_type: string;
    access_token: string;
    expires_in: number;
}

export interface LogRequest {
    stack: Stack;
    level: Level;
    package: Package;
    message: string;
}

export interface LogResponse {
    logID: string;
    message: string;
}
