export interface Boardgame {
    name: string;
    players: {
        min: number,
        max: number | null,
    };
}