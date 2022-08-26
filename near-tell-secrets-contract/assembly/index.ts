import { Secret, listedSecret } from "./model";
import { ContractPromiseBatch, context } from "near-sdk-as";

export function addSecret(secret: Secret): void {
  let storedSecret = listedSecret.get(secret.id);
  if (storedSecret !== null) {
    throw new Error(`secret with ${secret.id} already exists`);
  }
  listedSecret.set(secret.id, Secret.fromPayload(secret));
}

export function getSecret(id: string): Secret | null {
  return listedSecret.get(id);
}

export function getSecrets(): Secret[] {
  return listedSecret.values();
}

export function giftOwner(secretId: string, amount: string): void {
  const secret = getSecret(secretId);
  if (secret == null) {
    throw new Error("secret not found");
  }

  if (amount.toString() != context.attachedDeposit.toString()) {
    throw new Error("attached deposit should equal to the secret's price");
  }
  ContractPromiseBatch.create(secret.owner).transfer(context.attachedDeposit);
  listedSecret.set(secret.id, secret);
}

export function likeSecret(secretId: string): void {
  const secret = getSecret(secretId);
  if (secret == null) {
    throw new Error("secret not found");
  }
  secret.owner = context.sender;
  secret.likes++;
  listedSecret.set(secret.id, secret);
}

export function dislikeSecret(secretId: string): void {
  const secret = getSecret(secretId);
  if (secret == null) {
    throw new Error("secret not found");
  }
  secret.owner = context.sender;
  secret.dislikes++;
  listedSecret.set(secret.id, secret);
}
