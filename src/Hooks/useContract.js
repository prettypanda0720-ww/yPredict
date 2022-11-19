import vesting from "../abi/Vesting.json";
import { useCall } from "@usedapp/core";
import { ethers } from "ethers";

const vestingInterface = new ethers.utils.Interface(vesting);

export const useGetAllocatedTokens = (user, contract) => {
  const { value, error } =
    useCall({
      contract: new ethers.Contract(contract, vestingInterface),
      method: "getAllocatedTokens",
      args: [user],
    }) ?? {};
  if (error) {
    console.log(error.message);
    return undefined;
  }
  return value?.[0];
};

export const useGetClaimableTokens = (user, contract) => {
  const { value, error } =
    useCall({
      contract: new ethers.Contract(contract, vestingInterface),
      method: "getClaimableTokens",
      args: [user],
    }) ?? {};
  if (error) {
    console.log(error.message);
    return undefined;
  }
  return value?.[0];
};

export const useGetClaimedTokens = (user, contract) => {
  const { value, error } =
    useCall({
      contract: new ethers.Contract(contract, vestingInterface),
      method: "getClaimedTokens",
      args: [user],
    }) ?? {};
  if (error) {
    console.log(error.message);
    return undefined;
  }
  return value?.[0];
};
