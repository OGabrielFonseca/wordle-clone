import { TileStatus } from '../enums/tile-status.enum';

export interface TileData {
  letter: string;
  status: TileStatus;
  isActive: boolean;
}
