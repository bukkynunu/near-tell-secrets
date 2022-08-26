import { PersistentUnorderedMap, u128, context, PersistentMap } from "near-sdk-as";

@nearBindgen
export class Secret {
  id: string;
  owner: string;
  secretText: string;
  likes: u32;
  dislikes: u32;

  public static fromPayload(payload: Secret): Secret {
    const secret = new Secret();
    secret.id = payload.id;
    secret.secretText = payload.secretText;
    secret.owner = context.sender;
    secret.likes = 0;
    secret.dislikes = 0;
    return secret;
  }

  public addLike(alreadyDisliked: boolean = false) : void {
    this.likes++;
    if(alreadyDisliked){
      this.dislikes--;
    }
  }

  public addDislike(alreadyLiked: boolean = false) : void {
    this.dislikes++;
    if(alreadyLiked){
      this.likes--;
    }
  }

}

export const listedSecret = new PersistentUnorderedMap<string, Secret>("secret");


@nearBindgen
export class UserReaction {
  likes : string[];
  disLikes: string[];

  public static init() : UserReaction {
    const userReaction = new UserReaction();
    userReaction.likes = [];
    userReaction.disLikes = [];

    return userReaction;
  }
}

export const userReactionStorage = new PersistentUnorderedMap<string, UserReaction>("USER_REACTION");
