import { v4 as uuid4 } from "uuid";
import { parseNearAmount } from "near-api-js/lib/utils/format";

const GAS = 100000000000000;

export function addSecret( secret ) {
  console.log(secret);
  secret.id = uuid4();

  // secret.amount = parseNearAmount(secret.amount + "");
  // secret.uploadFee = parseNearAmount(amount+"");
  console.log(secret);
  return window.contract.addSecret({ secret });
}

export function getSecrets() {
  return window.contract.getSecrets();
}

export async function giftOwner({ id, amount }) {
  console.log(id, amount);
  const _amount = parseNearAmount(amount)
  await window.contract.giftOwner({ secretId: id, amount:_amount }, GAS, _amount);

}

export async function likeSecret({ id }) {
  await window.contract.likeSecret({ secretId: id });
}

export async function dislikeSecret({ id }) {
  await window.contract.dislikeSecret({ secretId: id });
}

