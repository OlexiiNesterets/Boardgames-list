import { Boardgame } from './models/boardgame';

export const gamesList: Boardgame[] = [
    { name: 'Patchwork', players: { min: 2, max: 2 } },
    { name: 'Колонизаторы', players: { min: 3, max: 4 } },
    { name: 'Alias', players: { min: 4, max: null } },
    { name: 'Подорож Україною', players: { min: 3, max: 5 } },
    { name: 'Codenames', players: { min: 4, max: null } },
    { name: 'Звёздные империи', players: { min: 2, max: 2 } },
]