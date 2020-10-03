export interface INight {
  shots?: Record<string, string>; // <mafiaId, playerId>
  murderedPlayer?: string; // murdered player id
  donCheck?: string; // id of player checked by Don
  sheriffCheck?: string; // id of player checked by Sheriff
}
