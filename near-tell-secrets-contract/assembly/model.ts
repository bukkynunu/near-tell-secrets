import { PersistentUnorderedMap, u128, context } from "near-sdk-as";

@nearBindgen
export class Secret {
	id: string;
	owner: string;
	secretText: string;
	likes: i8;
	giftAmount: u128;

	public static fromPayload(payload: Secret): Secret {
		const secret = new Secret();
		secret.id = payload.id;
		secret.secretText = payload.secretText;
		secret.owner = context.sender;
		secret.likes = 0;
		return secret;
	}

	public like(): void {
		this.likes = this.likes + 1;
	}

	public dislike(): void {
		this.likes = this.likes - 1;
	}

	public gift(amount: u128): void {
		this.giftAmount = u128.add(this.giftAmount, amount);
	}
}

export const listedSecret = new PersistentUnorderedMap<string, Secret>(
	"secret"
);

export const likedStorage = new PersistentUnorderedMap<string, string[]>(
	"USERS_LIKED"
);
