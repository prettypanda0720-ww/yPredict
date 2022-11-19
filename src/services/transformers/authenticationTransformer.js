import _ from "lodash";

// From  API to UI
export function hydrateConnectWallet(data) {
  return {
    userId: data._id,
    walletId: data.walletId,
    totalYpredict: data.totalYpredict,
    lockedYpredict: data.lockedYpredict,
    availableYpredict: data.availableYpredict,
  };
}


// From UI to API
export function deHydrateConnectWallet(data) {
  return {
    walletId: data.walletId,
  };
}
