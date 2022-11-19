import React, {useEffect, useState, useReducer} from 'react';
import {connect, useDispatch} from 'react-redux';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import Web3Modal from 'web3modal';
import _ from 'lodash';
import {Dropdown} from 'semantic-ui-react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';

import WalletConnectProvider from '@walletconnect/web3-provider';
import {connectWallet} from '../../actions/authenticationAction';
import {setContract} from '../../actions/contractAction';
import {customToast} from '../../helpers/customToast';
import {useEthers, useEtherBalance} from '@usedapp/core';
import {
  supportedChainId,
  infuraId,
  rpcUrl,
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
} from '../../config';
import {formatEther} from 'ethers/lib/utils';
import {humanizeAddress} from '../../helpers/walletManagementFunctions';

const etheriumAmountOptions = [
  {
    key: '$150,000',
    text: '$150,000',
    value: '$150,000',
    image: {avatar: true, src: 'images/ethereum.svg'},
  },
  {
    key: '$150,000',
    text: '$150,000',
    value: '$150,000',
    image: {avatar: true, src: 'images/ethereum.svg'},
  },
  {
    key: '$150,000',
    text: '$150,000',
    value: '$150,000',
    image: {avatar: true, src: 'images/ethereum.svg'},
  },
];

const Header = (props) => {
  const {account, activate, deactivate, chainId, switchNetwork} = useEthers();
  const dispatch = useDispatch()
  const userBalance = useEtherBalance(account);
  const formattedBalance = userBalance ? formatEther(userBalance) : 0;
  const [selectContract, setSelectContract] = useState(advisor);
  const [vestingContract, setVestingContract] = useState(treasury);
  const [yPredictContract, setYPredictContract] = useState('0x1034d626A4f5FDbb31d6C22A26D0fF46a5A2d32E');
  const [vestingContractName, setVestingContractName] = useState('Treasury');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [yPredictOrVesting, setYPredictOrVesting] = useState(0);

  const activateProvider = async () => {
    const providerOptions = {
      injected: {
        display: {
          name: 'Metamask',
          description: 'Connect with the provider in your Browser',
        },
        package: null,
      },
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          bridge: 'https://bridge.walletconnect.org',
          infuraId: infuraId,
        },
      },
      coinbasewallet: {
        package: CoinbaseWalletSDK,
        options: {
          appName: 'Y Predict',
          infuraId: infuraId,
          rpc: rpcUrl,
          chainId: supportedChainId,
          darkMode: false,
        },
      },
    };

    const web3Modal = new Web3Modal({
      providerOptions,
    });
    try {
      const provider = await web3Modal.connect();
      //customToast.success('Successfully Connected');
      const response = await activate(provider);
      console.log('response - ', response);
    } catch (error) {
      // customToast.error(error);
    }
  };

  useEffect(() => {
    if (chainId != supportedChainId) {
      switchNetwork(supportedChainId);
    }
  }, [chainId]);

  return (
    <div className="header">
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        onClose={() => {
          console.log('snackbar close');
          setSnackbarOpen(false);
        }}
      >
        <Alert
          onClose={() => {
            console.log('alert close');
            setSnackbarOpen(false);
          }}
          severity="success"
          sx={{width: '100%'}}
        >
          Copied
        </Alert>
      </Snackbar>


      
      
      <div className="header-content clearfix">
        <div className="header-left header-left-top">
          <div className="input-group icons">
            <input className="input-elevated" type="text" placeholder="Search Here..." />
          </div>

          <div className="crypto-transaction">
            
            <div className="crypto-image">
              <img src="images/token-1.svg" className="crypto-icon" alt="crypto" />
            </div>

            <div className="crypto-transaction-info">

                <div className='transaction-amount'>168,331.09</div>
                <div className='transaction-status'>

                  <img src='images/stock-upsymbol.svg' className='stopup' alt=''/>
                 <span className='upsymbol-percent'>45%</span>
                 <span className='upsymbol-week'>this week</span>

                </div>


            </div>

            

          </div>


          <div className="crypto-transaction">
            
            <div className="crypto-image">
              <img src="images/token-2.svg" className="crypto-icon" alt="crypto" />
            </div>

            <div className="crypto-transaction-info">

                <div className='transaction-amount'>168,331.09</div>
                <div className='transaction-status'>

                  <img src='images/stock-upsymbol.svg' className='stopup' alt=''/>
                 <span className='upsymbol-percent'>45%</span>
                 <span className='upsymbol-week'>this week</span>

                </div>


            </div>

            

          </div>


          <div className="crypto-transaction">
            
            <div className="crypto-image">
              <img src="images/token-3.svg" className="crypto-icon" alt="crypto" />
            </div>

            <div className="crypto-transaction-info">

                <div className='transaction-amount'>168,331.09</div>
                <div className='transaction-status'>

                  <img src='images/stock-upsymbol.svg' className='stopup' alt=''/>
                 <span className='upsymbol-percent'>45%</span>
                 <span className='upsymbol-week'>this week</span>

                </div>


            </div>

            

          </div>



        </div>
        <div className="header-right">
          <ul className="clearfix header-ul">


          <li className="li-vesting-contract header-top-btn">
              <div className="contract-selection">
                <div className="contract-button">
                  <Select
                    value={selectContract}
                    input={<OutlinedInput />}
                    onChange={(event, obj) => {
                      // console.log('handleSwitchChange event -', obj.props.name);
                      // console.log('handleSwitchChange event -', event.target.name);
                      const {
                        target: {value},
                      } = event;

                      console.log('handleSwitchChange  -', value);
                      setSelectContract(value);
                      dispatch(setContract(value));
                      setVestingContractName(obj.props.name);
                    }}
                    displayEmpty
                  >
                    <MenuItem value={advisor} name={'Advisor'}>
                      Advisor
                    </MenuItem>
                    <MenuItem value={development} name={'Development'}>
                      Development
                    </MenuItem>
                    <MenuItem value={influencers} name={'Influencers'}>
                      Influencers
                    </MenuItem>
                    <MenuItem value={liquidity} name={'Liquidity'}>
                      Liquidity
                    </MenuItem>
                    <MenuItem value={marketing} name={'Marketing'}>
                      Marketing
                    </MenuItem>
                    <MenuItem value={presale} name={'Presale'}>
                      Presale
                    </MenuItem>
                    <MenuItem value={privatesale} name={'Privatesale'}>
                      Privatesale
                    </MenuItem>
                    <MenuItem value={staking} name={'Staking'}>
                      Staking
                    </MenuItem>
                    <MenuItem value={team} name={'Team'}>
                      Team
                    </MenuItem>
                    <MenuItem value={treasury} name={'Treasury'}>
                      Treasury
                    </MenuItem>
                  </Select>
                </div>
              </div>

             


            </li>

            <li className="icons header-top-btn balance-section">

            <Tooltip title="Copy to clipboard">
                <span className="vesting-contaract">
                  <img
                    alt="copy to clipboard"
                    className="copy-to-clipboard"
                    src="images/copy-to-clipboard.svg"
                    onClick={() => {
                      const text =
                        yPredictOrVesting === 0 ? `${selectContract}${vestingContract}` : `${yPredictContract}`;
                      navigator.clipboard.writeText(`${text}`);
                      setSnackbarOpen(true);
                    }}
                  />
                </span>
              </Tooltip>

            </li>


            <li className="icons header-top-btn balance-section">
              <a href>
                <i className="fab fa-ethereum" aria-hidden="true"></i> {parseFloat(formattedBalance).toFixed(4)}
              </a>
            </li>



            {/* <li className="li-vesting-contract header-top-btn">
              <div className="contract-selection">
                <div className="contract-button">
                  <Dropdown
                    placeholder="$150,000"
                    fluid
                    selection
                    options={etheriumAmountOptions}
                    defaultValue={'$150,000'}
                  />
                </div>
              </div>

             

            </li> */}

            <li className="icons header-top-btn balance-section">
            <span className="vesting-contaract">
                <img
                  alt="expand"
                  className="copy-to-clipboard"
                  src="images/expand.svg"
                  onClick={() => {
                    console.log("expand clicked");
                  }}
                />
              </span>
            </li>


            <li className="icons header-top-btn balance-section">
            <span className="vesting-contaract">
                <img
                  alt="copy to clipboard"
                  className="copy-to-clipboard"
                  src="images/bell.svg"
                  onClick={() => {
                    console.log("bell clicked");
                  }}
                />
              </span>
            </li>


            <li className="icons header-top-btn balance-section">
            <span className="vesting-contaract">
                <img
                  alt="message"
                  className="copy-to-clipboard"
                  src="images/message-lines.svg"
                  onClick={() => {
                    
                      console.log("message clicked");

                  }}
                />
              </span>
            </li>


         

            <li className="icons dropdown header-top-btn">
              {account ? (
                <a style={{cursor: 'pointer'}} href onClick={() => deactivate()}>
                  <i className="fas fa-wallet"> </i>
                  {`${account.slice(0, 4)}...${account.slice(account.length - 5, account.length - 1)} `}
                  Disconnect [{humanizeAddress(props.walletId)}]
                </a>
              ) : (
                <a style={{cursor: 'pointer'}} href onClick={() => activateProvider()}>
                  <i className="fas fa-wallet"></i>
                  Connect Wallet
                </a>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state, ownprops) => {
  console.log('state at header - ', state);
  console.log('ownprops at header - ', ownprops);
  return {
    isAuthenticated:
      state && state.authentication && state.authentication.data && state.authentication.data.walletId ? true : false,
    walletId:
      state && state.authentication && state.authentication.data && state.authentication.data.walletId
        ? state.authentication.data.walletId
        : null,
  };
};

export default connect(mapStateToProps, {
  connectWallet,
})(Header);
