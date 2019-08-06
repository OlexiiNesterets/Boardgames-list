export interface Boardgame {
    name: string;
    searchName?: string;
    players: {
        min: number,
        max: number | null,
    };
}