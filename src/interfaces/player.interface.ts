export interface Player {
  id: string;
  gameName: string;
  tagLine: string;
  tier: string;
  rank: string;
  wins: number;
  losses: number;
  leaguePoints: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlayerCreate {
  gameName: string;
  tagLine: string;
}

export interface PlayerUpdate {
  id: string;
  tier: string;
  rank: string;
  wins: number;
  losses: number;
  leaguePoints: number;
}

export interface PlayerRepository {
  create(data: PlayerCreate): Promise<Player>;
  findByNameAndTag(gameName: string, tagLine: string): Promise<Player | null>;
  findAll(): Promise<Player[]>;
  findById(id: string): Promise<Player | null>;
  update({ id, tier, rank, wins, losses, leaguePoints }: PlayerUpdate): Promise<Player>;
  delete(id: string): Promise<boolean>;
}
