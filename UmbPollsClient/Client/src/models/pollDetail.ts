export interface PollDetail {
    stats: Stat[];
    types: Type[];
    moves: Move[];
    height: number;
    name: string;
    sprites: Sprites;
    weight: number;
}

export interface Stat {
    base_stat: number;
    effort: number;
    stat: Stat1;
}

export interface Stat1 {
    name: string;
    url: string;
}

export interface Type {
    slot: number;
    type: Type1;
}

export interface Type1 {
    name: string;
    url: string;
}

export interface Move {
    move: Move1;
    version_group_details: VersionGroupDetails[];
}

export interface Move1 {
    name: string;
    url: string;
}
export interface VersionGroupDetails {
    level_learned_at: number;
    move_learn_method: MoveLearnMethod;
    version_group: VersionGroup;
}

export interface MoveLearnMethod {
    name: string;
    url: string;
}

export interface VersionGroup {
    name: string;
    url: string;
}

export interface Sprites {
    front_default: string;
}