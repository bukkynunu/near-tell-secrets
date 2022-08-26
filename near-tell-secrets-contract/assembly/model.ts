import { PersistentUnorderedMap, u128, context } from "near-sdk-as";

@nearBindgen
export class Secret {
  id: string;
  owner: string;
  secretText: string;
  likes: i8;
  dislikes: i8;

  public static fromPayload(payload: Secret): Secret {
    const secret = new Secret();
    secret.id = payload.id;
    secret.secretText = payload.secretText;
    secret.owner = context.sender;
    secret.likes = 0;
    return secret;
  }

}

export const listedSecret = new PersistentUnorderedMap<string, Secret>(
  "secret"
);
