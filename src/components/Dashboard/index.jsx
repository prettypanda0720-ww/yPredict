/* eslint-disable react-hooks/rules-of-hooks */
import React, {useState, useEffect} from 'react';
import {useEthers, useTokenBalance} from '@usedapp/core';
import {connect} from 'react-redux';
import {Tab, Dropdown, Checkbox, Modal} from 'semantic-ui-react';
import TradingViewWidget, {Themes} from 'react-tradingview-widget';
import $ from 'jquery';
import {customToast} from '../../helpers/customToast';
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
} from '../../config';
import WalletConnectProvider from '@walletconnect/web3-provider';
import {ethers} from 'ethers';
import {formatEther} from 'ethers/lib/utils';
import _ from 'lodash';
import {useGetClaimableTokens, useGetClaimedTokens, useGetAllocatedTokens} from '../../Hooks/useContract';
import vestige from '../../abi/Vesting.json';
import Header from '../common/Header';

const panes = [
  {
    menuItem: 'Overall',
    render: () => (
      <Tab.Pane attached={false}>
        <div className="tab-row">
          <div className="tab-row-left-item">Pattern 1</div>
          <div className="tab-row-right-item">
            <div className="time">1m</div>
            <div className="status-icon active"></div>
          </div>
        </div>

        <div className="tab-row">
          <div className="tab-row-left-item">Pattern 1</div>
          <div className="tab-row-right-item">
            <div className="time">1m</div>
            <div className="status-icon active"></div>
          </div>
        </div>
      </Tab.Pane>
    ),
  },
  {
    menuItem: 'AI Signals',
    render: () => (
      <Tab.Pane attached={false}>
        <div className="tab-row">
          <div className="tab-row-left-item">Pattern 1</div>
          <div className="tab-row-right-item">
            <div className="time">1m</div>
            <div className="status-icon active"></div>
          </div>
        </div>

        <div className="tab-row">
          <div className="tab-row-left-item">Pattern 1</div>
          <div className="tab-row-right-item">
            <div className="time">1m</div>
            <div className="status-icon active"></div>
          </div>
        </div>
      </Tab.Pane>
    ),
  },
  {
    menuItem: 'Breakout',
    render: () => (
      <Tab.Pane attached={false}>
        <div className="tab-row">
          <div className="tab-row-left-item">Pattern 1</div>
          <div className="tab-row-right-item">
            <div className="time">1m</div>
            <div className="status-icon active"></div>
          </div>
        </div>

        <div className="tab-row">
          <div className="tab-row-left-item">Pattern 1</div>
          <div className="tab-row-right-item">
            <div className="time">1m</div>
            <div className="status-icon active"></div>
          </div>
        </div>
      </Tab.Pane>
    ),
  },
  {
    menuItem: 'Patterns',
    render: () => (
      <Tab.Pane attached={false}>
        <div className="tab-row">
          <div className="tab-row-left-item">Pattern 1</div>
          <div className="tab-row-right-item">
            <div className="time">1m</div>
            <div className="status-icon active"></div>
          </div>
        </div>

        <div className="tab-row">
          <div className="tab-row-left-item">Pattern 2</div>
          <div className="tab-row-right-item">
            <div className="time">2m</div>
            <div className="status-icon active"></div>
          </div>
        </div>
      </Tab.Pane>
    ),
  },
  {
    menuItem: 'Technical',
    render: () => (
      <Tab.Pane attached={false}>
        <div className="tab-row">
          <div className="tab-row-left-item">Pattern 1</div>
          <div className="tab-row-right-item">
            <div className="time">1m</div>
            <div className="status-icon active"></div>
          </div>
        </div>

        <div className="tab-row">
          <div className="tab-row-left-item">Pattern 1</div>
          <div className="tab-row-right-item">
            <div className="time">1m</div>
            <div className="status-icon active"></div>
          </div>
        </div>
      </Tab.Pane>
    ),
  },
  {
    menuItem: 'Social Sentiment',
    render: () => (
      <Tab.Pane attached={false}>
        <div className="tab-row">
          <div className="tab-row-left-item">Pattern 1</div>
          <div className="tab-row-right-item">
            <div className="time">1m</div>
            <div className="status-icon active"></div>
          </div>
        </div>

        <div className="tab-row">
          <div className="tab-row-left-item">Pattern 1</div>
          <div className="tab-row-right-item">
            <div className="time">1m</div>
            <div className="status-icon active"></div>
          </div>
        </div>
      </Tab.Pane>
    ),
  },
  {
    menuItem: 'News Sentiment',
    render: () => (
      <Tab.Pane attached={false}>
        <div className="tab-row">
          <div className="tab-row-left-item">Pattern 1</div>
          <div className="tab-row-right-item">
            <div className="time">1m</div>
            <div className="status-icon active"></div>
          </div>
        </div>

        <div className="tab-row">
          <div className="tab-row-left-item">Pattern 2</div>
          <div className="tab-row-right-item">
            <div className="time">1m</div>
            <div className="status-icon active"></div>
          </div>
        </div>

        <div className="tab-row">
          <div className="tab-row-left-item">Pattern 3</div>
          <div className="tab-row-right-item">
            <div className="time">1m</div>
            <div className="status-icon active"></div>
          </div>
        </div>
      </Tab.Pane>
    ),
  },
];

const tokenSwappingOptions = [
  {
    key: 'Etheriam',
    text: 'ETH',
    value: 'Etheriam',
    image: {avatar: true, src: 'images/eth-dropdown.svg'},
  },
  {
    key: 'Bitcoin',
    text: 'BTC',
    value: 'Bitcoin',
    image: {avatar: true, src: 'images/eth-dropdown.svg'},
  },
];

const Dashboard = (props) => {
  const {account} = useEthers();
  const [selectContract, setSelectContract] = useState(9);
  const [vestingContract, setVestingContract] = useState(treasury);
  const [yPredictContract, setYPredictContract] = useState('0x1034d626A4f5FDbb31d6C22A26D0fF46a5A2d32E');
  const [vestingContractName, setVestingContractName] = useState('Treasury');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [yPredictOrVesting, setYPredictOrVesting] = useState(0);
  const userAccount = account ? account : ethers.constants.AddressZero;
  const userBalance = useTokenBalance(token, account);
  const formattedBalance = userBalance ? formatEther(userBalance) : 0;
  const vestigeInterface = new ethers.utils.Interface(vestige);
  const claimedTokens = useGetClaimedTokens(userAccount, vestingContract);
  const formattedClaimedTokens = claimedTokens ? formatEther(claimedTokens).toString() : 0;

  const allocatedTokens = useGetAllocatedTokens(userAccount, vestingContract);
  const formattedAllocatedTokens = allocatedTokens ? formatEther(allocatedTokens).toString() : 0;

  const claimableTokens = useGetClaimableTokens(userAccount, vestingContract);
  const formattedClaimableTokens = claimableTokens ? formatEther(claimableTokens).toString() : 0;

  const lockedTokens =
    parseFloat(formattedAllocatedTokens) - (parseFloat(formattedClaimableTokens) + parseFloat(formattedClaimedTokens));

  const lockedPercentage =
    100 -
    ((parseFloat(formattedClaimableTokens) + parseFloat(formattedClaimedTokens)) / formattedAllocatedTokens) * 100;

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
    getAddress();

    console.log('dom is loaded', $(document).height());
    console.log('dom is loaded window ', $(window).height());
    const windowHeight = $(window).height();
    $('.dashboard-right-section').height(windowHeight - 360 + 'px');
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
          customToast.success('Sucessfully Claimed');
        } else {
          const walletConnectProvider = new WalletConnectProvider({
            infuraId: infuraId,
            qrcode: true,
          });

          await walletConnectProvider.enable();

          const provider = new ethers.providers.Web3Provider(walletConnectProvider);

          const signer = provider.getSigner();

          let contract = new ethers.Contract(advisor, vestigeInterface, signer);
          let claimTokensTx = await contract.claimTokens([account]);

          await claimTokensTx.wait();
          customToast.success('Sucessfully Claimed');
        }
      } else {
        console.log('Connect wallet');
        customToast.error('Connect Wallet');
      }
    } catch (error) {
      console.log(error);
      customToast.error(error);
    }
  };

  return (
    <>
      {/* <div id="preloader" style={{display:"none"}}>
        <div className="loader">
          <svg className="circular" viewBox="25 25 50 50">
            <circle className="path" cx="50" cy="50" r="20" fill="none" stroke-width="3" stroke-miterlimit="10" />
          </svg>
        </div>
      </div> */}

      <div id="main-wrapper">
        <div className="nav-header">
          <div className="brand-logo">
            <a href="index.html">
              <b className="logo-abbr">
                <img src="images/logo.svg" alt="" />{' '}
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
          <div className="dashboard-left-section">
            <div className="trading-view-widget">
              <TradingViewWidget
                theme={Themes.DARK}
                symbol="NASDAQ:AAPL"
                width="100%"
                height="400px"
                // interval="1m"
                timezone="Etc/UTC"
                locale="en"
                toolbar_bg="#f1f3f6"
                enable_publishing={false}
                hide_top_toolbar={false}
                save_image={true}
                container_id="tradingview_44c44"
              />
            </div>

            <div className="tab-panel">
              <Tab menu={{borderless: true, attached: false, tabular: false}} panes={panes} />
            </div>
          </div>

          <div className="dashboard-right-section">
            <div className="swapping-sec">
              <div className="swapping-selection">
                <Dropdown
                  placeholder="$150,000"
                  fluid
                  selection
                  options={tokenSwappingOptions}
                  defaultValue={'Etheriam'}
                  className="token-swapping"
                />
                <input type="text" className="token-swap-input" placeholder="0.00" />
              </div>

              <div className="swap">
                <img alt="expand" className="copy-to-clipboard" src="images/swap.svg" onClick={() => {}} />
              </div>

              <div className="swapping-selection">
                <Dropdown
                  placeholder="$150,000"
                  fluid
                  selection
                  options={tokenSwappingOptions}
                  defaultValue={'Etheriam'}
                  className="token-swapping"
                />
                <input type="text" className="token-swap-input" placeholder="0.00" />
              </div>

              <div className="swapbutton">Swap</div>
            </div>

            <div
              className="advanced-option-sec"
              
            >
              <div className="advanced-option"
              onClick={() => {
                setModalOpen(!modalOpen);
              }}
              >
                <span className="advanced-option-text">Advance option</span>
                <img src={modalOpen?"images/chevron-up-solid.svg":"images/chevron-down-solid.svg"} alt="" className="advanced-option-icon" />
              </div>

               <div className='modal-content' style={{display: modalOpen?'flex':'none'}}>
                
               <div className="buy-sell-popup">
              <div className="buy-sell-content">
                <div className="buysell-title">
                  <div className="sec-title">BUY</div>
                  <div className="sec-title">SELL</div>
                </div>
                <div className="advanced-option-separator"></div>
                <div className="buysell-section">
                  <div className="sec-buy">
                    <div className="swapping-selection buysell buy">
                      <Dropdown
                        placeholder="$150,000"
                        fluid
                        selection
                        options={tokenSwappingOptions}
                        defaultValue={'Etheriam'}
                        className="token-swapping"
                      />
                      <input type="text" className="token-swap-input" placeholder="0.00" />
                    </div>

                    <div class="popup1__progress progress">
                      <span class="progress__item progress__item_1">25%</span>
                      <span class="progress__item progress__item_2">50%</span>
                      <span class="progress__item progress__item_3">75%</span>
                      <span class="progress__item progress__item_4">100%</span>
                    </div>

                    <div className="swapping-selection buysell buy">
                      <Dropdown
                        placeholder="$150,000"
                        fluid
                        selection
                        options={tokenSwappingOptions}
                        defaultValue={'Etheriam'}
                        className="token-swapping"
                      />
                      <input type="text" className="token-swap-input" placeholder="0.00" />
                    </div>

                    <div className="button-sec">
                      <div className="buysell-button buy-button" onClick={() => {}}>
                        BUY
                      </div>
                    </div>
                  </div>

                  <div className="sec-sell">
                    <div className="swapping-selection buysell sell">
                      <Dropdown
                        placeholder="$150,000"
                        fluid
                        selection
                        options={tokenSwappingOptions}
                        defaultValue={'Etheriam'}
                        className="token-swapping"
                      />
                      <input type="text" className="token-swap-input" placeholder="0.00" />
                    </div>

                    <div class="popup1__progress progress">
                      <span class="progress__item progress__item_1">25%</span>
                      <span class="progress__item progress__item_2">50%</span>
                      <span class="progress__item progress__item_3">75%</span>
                      <span class="progress__item progress__item_4">100%</span>
                    </div>

                    <div className="swapping-selection buysell sell">
                      <Dropdown
                        placeholder="$150,000"
                        fluid
                        selection
                        options={tokenSwappingOptions}
                        defaultValue={'Etheriam'}
                        className="token-swapping"
                      />
                      <input type="text" className="token-swap-input" placeholder="0.00" />
                    </div>

                    <div className="button-sec">
                      <div className="buysell-button sell-button" onClick={() => {}}>
                        SELL
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
                
                </div> 

            </div>

            <div className="advanced-option-separator"></div>

            <div className="myfav-sec">
              <div className="myfav-option">
                <span className="myfav-text">My Fav</span>
                <img src="images/chevron-down-solid.svg" alt="" className="advanced-option-icon" />
              </div>

              <Checkbox label="Signals" />
              <Checkbox label="Breakouts" />
              <Checkbox label="News" />
            </div>

            <div className="features-image-section">
              <img src="images/breakout.png" class="feature-image breakout" alt="" />
              <img src="images/social-sentiment.png" class="feature-image social" alt="" />
              <img src="images/news-sentiment.png" class="feature-image news" alt="" />
            </div>
          </div>
        </div>

     
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  console.log('Dashboard mapStateToProps state - ', state);
  return {
    availableYpredict: state.authentication.data ? state.authentication.data.availableYpredict : 0,
    lockedYpredict: state.authentication.data ? state.authentication.data.lockedYpredict : 0,
    totalYpredict: state.authentication.data ? state.authentication.data.totalYpredict : 0,
    userId: state.authentication.data ? state.authentication.data.userId : 0,
    walletId: state.authentication.data ? state.authentication.data.walletId : 0,
  };
};

export default connect(mapStateToProps, {})(Dashboard);
