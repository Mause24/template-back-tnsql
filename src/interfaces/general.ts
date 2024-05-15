export enum PROFILES {
    ADMIN = 1,
    CLIENT = 2,
    STAFF = 3,
}

export interface JWTInterface {
    id: number
    email: string
    password: string
    profileId: PROFILES
    iat?: number
}
