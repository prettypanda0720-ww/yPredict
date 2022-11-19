/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from "react";
import { useEthers, useTokenBalance } from "@usedapp/core";
import { connect } from "react-redux";
import { customToast } from "../../helpers/customToast";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import {
  token,
  advisor,
  development,
  influencers,
  liquidity,
  marketing,
  presale,
  privatesale,
  staking,
  team,
  treasury,
  infuraId,
} from "../../config";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import { formatEther } from "ethers/lib/utils";
import _ from "lodash";
import {
  useGetClaimableTokens,
  useGetClaimedTokens,
  useGetAllocatedTokens,
} from "../../Hooks/useContract";
import vestige from "../../abi/Vesting.json";
import Header from "../common/Header";
import TextTimerComponent from "../TextTimer";

const Dapp = (props) => {
  const { account, library, chainId } = useEthers();
  const [selectContract, setSelectContract] = useState("0xf5ec0Cd058a0553A5538936bbbd51344aDf93654");
  const [endTime, setEndTime] = useState(9);
  const [vestingContract, setVestingContract] = useState(treasury);
  const [allocatedTokenAmount, setAllocatedAmount] = useState(0);
  const [claimableTokenAmount, setClaimableAmount] = useState(0);
  const [claimedTokenAmount, setClaimedAmount] = useState(0);
  const [lockedTokenAmount, setLockedAmount] = useState(0);
  const [lockedPercentage, setLockedPercentage] = useState(0);
  const [yPredictContract, setYPredictContract] = useState(
    "0x1034d626A4f5FDbb31d6C22A26D0fF46a5A2d32E"
  );
  const [vestingContractName, setVestingContractName] = useState("Treasury");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [yPredictOrVesting, setYPredictOrVesting] = useState(0);
  const userAccount = account ? account : ethers.constants.AddressZero;
  const userBalance = useTokenBalance(token, account);
  // const formattedBalance = userBalance ? formatEther(userBalance) : 0;
  // const vestigeInterface = new ethers.utils.Interface(vestige);
  // const claimedTokens = useGetClaimedTokens(userAccount, vestingContract);
  // const formattedClaimedTokens = claimedTokens
  //   ? formatEther(claimedTokens).toString()
  //   : 0;

  // const allocatedTokens = useGetAllocatedTokens(userAccount, vestingContract);
  // const formattedAllocatedTokens = allocatedTokens
  //   ? formatEther(allocatedTokens).toString()
  //   : 0;

  // const claimableTokens = useGetClaimableTokens(userAccount, vestingContract);
  // const formattedClaimableTokens = claimableTokens
  //   ? formatEther(claimableTokens).toString()
  //   : 0;

  // const lockedTokens =
  //   parseFloat(formattedAllocatedTokens) -
  //   (parseFloat(formattedClaimableTokens) + parseFloat(formattedClaimedTokens));

  // const lockedPercentage =
  //   100 -
  //   ((parseFloat(formattedClaimableTokens) +
  //     parseFloat(formattedClaimedTokens)) /
  //     formattedAllocatedTokens) *
  //     100;

  // console.log("*****************", props.contractAddress);

  const getAddress = () => {
    if (selectContract == 0) {
      setVestingContract(advisor);
    }
    if (selectContract == 1) {
      setVestingContract(development);
    }
    if (selectContract == 2) {
      setVestingContract(influencers);
    }
    if (selectContract == 3) {
      setVestingContract(liquidity);
    }
    if (selectContract == 4) {
      setVestingContract(marketing);
    }
    if (selectContract == 5) {
      setVestingContract(presale);
    }
    if (selectContract == 6) {
      setVestingContract(privatesale);
    }
    if (selectContract == 7) {
      setVestingContract(staking);
    }
    if (selectContract == 8) {
      setVestingContract(team);
    }
    if (selectContract == 9) {
      setVestingContract(treasury);
    }
  };

  useEffect(() => {
    const parseInfo = async () => {
      if (account) {
        try {
          let contractAddr = props.contractAddress
          if (contractAddr == 0) {
            contractAddr = "0xCc32481E00191BE2DA453b5CA047040541B21448" 
          }
          const vestingContract = new ethers.Contract(
            contractAddr,
            vestige,
            library.getSigner()
          );


          const start = await vestingContract.start()
          const lockDuration = await vestingContract.lockDuration();
          const endDate = parseInt(start) + parseInt(lockDuration);
          

          const allocatedToken = await vestingContract.getAllocatedTokens(
            account
          );
          const claimableToken = await vestingContract.getClaimableTokens(
            account
          );
          const claimedToken = await vestingContract.getClaimedTokens(account);

          const realAllocated = formatEther(allocatedToken);
          const realClaimable = formatEther(claimableToken);
          const realClaimed = formatEther(claimedToken);

          const _lockedTokens =
            parseFloat(realAllocated) -
            (parseFloat(realClaimable) + parseFloat(realClaimed));

          const _lockedPercentage =
            100 -
            ((parseFloat(realClaimable) + parseFloat(realClaimed)) /
              realAllocated) *
              100;

          console.log(
            "Getting Info>>>>",
            props.contractAddress,
            realAllocated,
            realClaimable,
            realClaimed
          );

          setAllocatedAmount(parseFloat(realAllocated));
          setClaimableAmount(parseFloat(realClaimable));
          setClaimedAmount(parseFloat(realClaimed));
          setLockedPercentage(_lockedPercentage);
          setLockedAmount(_lockedTokens);
          setEndTime(endTime);
        } catch (err) {
          console.log("Error", err);
        }
      }
    };

    parseInfo();
  }, [account, props.contractAddress]);

  useEffect(() => {
    getAddress();
  }, [vestingContract, selectContract, account, userAccount]);

  const claimTokens = async () => {
    try {
      if (account !== undefined) {
        if (window.ethereum !== undefined) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);

          const signer = provider.getSigner();

          let contract = new ethers.Contract(advisor, vestigeInterface, signer);
          let claimTokensTx = await contract.claimTokens([account]);

          await claimTokensTx.wait();
          customToast.success("Sucessfully Claimed");
        } else {
          const walletConnectProvider = new WalletConnectProvider({
            infuraId: infuraId,
            qrcode: true,
          });

          await walletConnectProvider.enable();

          const provider = new ethers.providers.Web3Provider(
            walletConnectProvider
          );

          const signer = provider.getSigner();

          let contract = new ethers.Contract(advisor, vestigeInterface, signer);
          let claimTokensTx = await contract.claimTokens([account]);

          await claimTokensTx.wait();
          customToast.success("Sucessfully Claimed");
        }
      } else {
        console.log("Connect wallet");
        customToast.error("Connect Wallet");
      }
    } catch (error) {
      console.log(error);
      customToast.error(error);
    }
  };

  return (
    <>
      {/* <div id="preloader">
        <div className="loader">
          <svg className="circular" viewBox="25 25 50 50">
            <circle
              className="path"
              cx="50"
              cy="50"
              r="20"
              fill="none"
              stroke-width="3"
              stroke-miterlimit="10"
            />
          </svg>
        </div>
      </div> */}

      <div id="main-wrapper">
        <div className="nav-header">
          <div className="brand-logo">
            <a href="index.html">
              <b className="logo-abbr">
                <img src="images/logo.svg" alt="" />{" "}
              </b>
              <span className="logo-compact">
                <img src="images/logo.svg" alt="" />
              </span>
              <span className="brand-title">
                <img src="images/logo.svg" alt="" />
              </span>
            </a>
          </div>
        </div>

        <Header></Header>

        <div className="content-body">
          <div className="container-fluid mt-3">
            <div className="row">
              <div className="col-xl-4 col-lg-6 col-sm-12 mb-30">
                <div className="card gradient-box">
                  <div className="card-body">
                    <div className="d-inline-block">
                      <h2 className="text-white">
                        {Number(allocatedTokenAmount).toFixed(4)}
                      </h2>
                      <h3 className="card-title text-white">Your YPRED</h3>
                    </div>
                    <span className="float-right display-5">
                      <img src="img/YPRED_1.png" alt="" />
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-6 col-sm-12 mb-30">
                <div className="card gradient-box">
                  <div className="card-body">
                    <div
                      className="d-flex cst-locked"
                      style={{ width: "100%", justifyContent: "space-between" }}
                    >
                      <div className="">
                        <h2 className="text-white">
                          {lockedTokenAmount.toFixed(4)}{" "}
                          <span>
                            {lockedPercentage
                              ? lockedPercentage.toFixed(2)
                              : 0.0}
                            %
                          </span>
                        </h2>

                        <h3 class="card-title text-white" style={{marginBottom: '10px'}}>Locked YPRED</h3>
                        <TextTimerComponent time={endTime} />
                      </div>
                      {/* 
                      <div className="duration">
                        <p>Duration until next unlock</p>
                        <h3 className="card-title text-white">N/A</h3>
                      </div> */}

                      <span className="float-right display-5">
                        <img src="img/YPRED_1.png" alt="" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-6 col-sm-12 mb-30">
                <div className="card gradient-box">
                  <div className="card-body">
                    <div className="d-inline-block">
                      <h2 className="text-white">
                        {Number(claimableTokenAmount).toFixed(4)}
                      </h2>
                      <h3 className="card-title text-white">Available YPRED</h3>
                    </div>
                    <span className="float-right display-5">
                      <a
                        style={{ cursor: "pointer" }}
                        onClick={() => claimTokens()}
                      >
                        Claim
                      </a>
                      <img src="img/YPRED_1.png" alt="" />
                    </span>
                  </div>
                </div>
              </div>
            </div>            
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  // console.log("Dapp mapStateToProps state - ", state);
  return {
    availableYpredict: state.authentication.data
      ? state.authentication.data.availableYpredict
      : 0,
    lockedYpredict: state.authentication.data
      ? state.authentication.data.lockedYpredict
      : 0,
    totalYpredict: state.authentication.data
      ? state.authentication.data.totalYpredict
      : 0,
    userId: state.authentication.data ? state.authentication.data.userId : 0,
    contractAddress: state.contractReducer.data ? state.contractReducer.data.address : 0,
    walletId: state.authentication.data
      ? state.authentication.data.walletId
      : 0,
  };
};

export default connect(mapStateToProps, {  })(Dapp);
