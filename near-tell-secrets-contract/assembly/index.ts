import { Secret, listedSecret, userReactionStorage, UserReaction } from "./model";
import { ContractPromiseBatch, context } from "near-sdk-as";

/**
 * Add a new secret
 * @param secret Secret object with details related to new secret
 */
export function addSecret(secret: Secret): void {
  let storedSecret = listedSecret.get(secret.id);
  if (storedSecret !== null) {
    throw new Error(`secret with ${secret.id} already exists`);
  }
  listedSecret.set(secret.id, Secret.fromPayload(secret));
}

/**
 * Get the details of a given secret
 * @param id ID of the secret
 * @return Secret object if it presents with the given ID. Otherwise, null
 */
export function getSecret(id: string): Secret | null {
  return listedSecret.get(id);
}

/**
 * Returns all secrets in the mapping
 * @return Secrets Array
 */
export function getSecrets(): Secret[] {
  return listedSecret.values();
}

/**
 * Gift NEAR to the secret owner of the given secret
 * @param secretId ID of the secret
 * @param amount Amount of the NEAR token which would like to donate
 */
export function giftOwner(secretId: string, amount: string): void {
  const secret = getSecret(secretId);
  if (secret == null) {
    throw new Error("secret not found");
  }

  if(secret.owner == context.sender.toString()){
    throw new Error("Cannot gift to own secrets")
  }

  if (amount.toString() != context.attachedDeposit.toString()) {
    throw new Error("attached deposit should equal to the secret's price");
  }

  ContractPromiseBatch.create(secret.owner).transfer(context.attachedDeposit);
}

/**
 * Put a like to a given secret
 * @param secretId ID of the secret
 */
export function likeSecret(secretId: string): void {
  const secret = getSecret(secretId);
  if (secret == null) {
    throw new Error("secret not found");
  }

  if(secret.owner == context.sender.toString()){
    throw new Error("You cannot put likes to own secrets")
  }

  let userReactions = userReactionStorage.get(context.sender);

  if(userReactions == null){
    userReactions = UserReaction.init();
  }

  if(userReactions.likes.includes(secretId)){
    throw new Error("You have already liked the secret")
  }

  if(userReactions.disLikes.includes(secretId)){
    secret.addLike(true);

    let dislikeIndex = userReactions.disLikes.indexOf(secretId);
    userReactions.disLikes.splice(dislikeIndex, 1);
  } else {
    secret.addLike();
  }
  userReactions.likes.push(secretId);

  listedSecret.set(secret.id, secret);
  userReactionStorage.set(context.sender, userReactions);
}

/**
 * Put a dislike to a given secret
 * @param secretId ID of the secret
 */
export function dislikeSecret(secretId: string): void {
  const secret = getSecret(secretId);
  if (secret == null) {
    throw new Error("secret not found");
  }

  if(secret.owner == context.sender.toString()){
    throw new Error("You cannot put dislikes to own secrets")
  }

  let userReactions = userReactionStorage.get(context.sender);

  if(userReactions == null){
    userReactions = UserReaction.init();
  }

  if(userReactions.disLikes.includes(secretId)){
    throw new Error("You have already disliked the secret")
  }

  if(userReactions.likes.includes(secretId)){
    secret.addDislike(true);

    let likeIndex = userReactions.likes.indexOf(secretId);
    userReactions.likes.splice(likeIndex, 1);
  } else {
    secret.addDislike();
  }
  userReactions.disLikes.push(secretId);

  listedSecret.set(secret.id, secret);
  userReactionStorage.set(context.sender, userReactions);
}


/**
 * Get the details of provided user's reactions to secrets
 * @return User Reaction object if it presents for the provided account ID. Otherwise, null
 */
export function getUserReactions(accountId : string): UserReaction | null {
  return userReactionStorage.get(accountId);
}
