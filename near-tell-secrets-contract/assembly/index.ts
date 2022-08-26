import { Secret, listedSecret, likedStorage } from "./model";
import { ContractPromiseBatch, context, u128 } from "near-sdk-as";

/**
 * @dev allow users to add a secret on the platform
 * @param secret object containing values to create an instance of Secret
 */
export function addSecret(secret: Secret): void {
	let storedSecret = listedSecret.get(secret.id);
	if (storedSecret !== null) {
		throw new Error(`secret with ${secret.id} already exists`);
	}
	assert(secret.secretText.length > 0, "Secret's text can't be empty");
	listedSecret.set(secret.id, Secret.fromPayload(secret));
}

export function getSecret(id: string): Secret | null {
	return listedSecret.get(id);
}

export function getSecrets(): Secret[] {
	return listedSecret.values();
}

/**
 * @dev allow users to gift the owner of a secret
 * @param secretId of secret
 * @param amount to be gifted
 */
export function giftOwner(secretId: string, amount: u128): void {
	const secret = getSecret(secretId);
	if (secret == null) {
		throw new Error("secret not found");
	}
	assert(
		secret.owner.toString() != context.sender.toString(),
		"You can't gift yourself"
	);
  assert(amount > u128.Min, "Invalid amount donated");
	if (amount.toString() != context.attachedDeposit.toString()) {
		throw new Error("attached deposit should equal to the secret's price");
	}
	secret.gift(amount);
	ContractPromiseBatch.create(secret.owner).transfer(context.attachedDeposit);
	listedSecret.set(secret.id, secret);
}

/**
 * @dev allow users to like a secret
 * @notice users can like a secret only once
 * @param secretId of a secret
 */
export function likeSecret(secretId: string): void {
	const secret = getSecret(secretId);
	if (secret == null) {
		throw new Error("secret not found");
	}
	const liked = likedStorage.get(context.sender);
	if (liked == null) {
		likedStorage.set(context.sender, [secretId]);
	} else {
		assert(liked.indexOf(secretId) == -1, "Already liked secret");
		liked.push(secretId);
		likedStorage.set(context.sender, liked);
	}
	secret.like();
	listedSecret.set(secret.id, secret);
}

/**
 * @dev allow users to dislike a secret
 * @notice users can only dislike a secret which they previously liked
 * @param secretId of secret
 */
export function dislikeSecret(secretId: string): void {
	const secret = getSecret(secretId);
	if (secret == null) {
		throw new Error("secret not found");
	}
	const liked = likedStorage.get(context.sender);
	if (liked == null) {
		throw new Error("You have not liked any secret yet");
	} else {
		assert(liked.indexOf(secretId) > -1, "You haven't liked this secret");
		const index = liked.indexOf(secretId);
		// removes only the current secretId from array
		liked.splice(index, 1);
		likedStorage.set(context.sender, liked);

		secret.dislike();
		listedSecret.set(secret.id, secret);
	}
}
