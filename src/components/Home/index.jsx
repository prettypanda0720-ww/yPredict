import React, {useState, useEffect} from 'react';
import {Switch, Route, NavLink, useHistory, useLocation} from 'react-router-dom';
import {connect, useSelector} from 'react-redux';
import classnames from 'classnames';
import Tooltip from '@material-ui/core/Tooltip';
import '../../styles/_iconmoon.scss';
import _ from 'lodash';
import {fetchProfileDetails} from './../../actions/authenticationAction';
import authenticationService from '../../services/authenticationService';
import useWindowDimensions from '../../Hooks/useWindowDimensions';

import {useTranslation} from 'react-i18next';
import i18n from './../../translations/i18n';
import storage from '../../services/storage';
import {ROLE} from '../../constants/appConstant';
import DisplayErrorModal from './../../components/common/DisplayErrorModal/DisplayErrorModal';

const Home = (props) => {
  const {t} = useTranslation();
  const {height, width} = useWindowDimensions();
  const location = useLocation();
  useEffect(() => {
    console.log('useEffect - ');
  }, []);

  console.log('height, width - ', height, width);

  const [open, setOpen] = useState(width < 1600 ? false : true);
  const [language, setLanguage] = useState(
    sessionStorage.getItem('selectedLanguage') ? sessionStorage.getItem('selectedLanguage') : 'english',
  );
  const [anchorEl, setAnchorEl] = React.useState(null);
  let history = useHistory();

  const {uiloading, isNavOpen, errorModalloading} = props;
  return (
    <>
      {/* {errorModalloading && <DisplayErrorModal />} */}
      <section className="site-wapper">
        <div className="nk-sidebar">
          <div className="nk-nav-scroll">
            <ul className="metismenu left-menu-main" id="menu">
              {/* Home */}
              <li className="mega-menu mega-menu-sm">
                <NavLink
                  to="/"
                  exact
                  isActive={(match, location) => {
                    let isActive = false;
                    if (match !== null) {
                      isActive = match.isExact;
                    }
                    return isActive || location.pathname.includes('/models');
                  }}
                >
                  <img src="img/left-menu1.png" alt="" />
                </NavLink>
              </li>

              <li className="mega-menu mega-menu-sm">
                <Tooltip title="Coming soon">
                  <a className="has-arrow1" href="javascript:void(0)" aria-expanded="false">
                    <img src="img/left-menu2.png" alt="" />
                  </a>
                </Tooltip>
              </li>

              <li className="mega-menu mega-menu-sm">
                <Tooltip title="Coming soon">
                  
                  <a className="has-arrow1" href="javascript:void(0)" aria-expanded="false">
                    <img src="img/left-menu3.png" alt="" />
                  </a>
                </Tooltip>
              </li>

              {/* Dapp */}
              <li className="mega-menu mega-menu-sm">
                <NavLink
                  to="/investors"
                  exact
                  isActive={(match, location) => {
                    let isActive = false;
                    if (match !== null) {
                      isActive = match.isExact;
                    }
                    return isActive || location.pathname.includes('/investors');
                  }}
                >
                  <img src="img/left-menu4.png" alt="" />
                </NavLink>
              </li>
            </ul>

            <ul className="metismenu bottom-brand-logo" id="menu">
              <li className="mega-menu mega-menu-sm">
                <Tooltip title="Coming soon">
                  <a className="has-arrow1" href="javascript:void()" aria-expanded="false">
                    <img src="img/left-bottom.png" alt="" />
                  </a>
                </Tooltip>
              </li>
            </ul>
          </div>
        </div>

        <main className="site-content">
          {uiloading && <div className="loader-spin"></div>}
          {props.children}
        </main>
      </section>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    uiloading: state.ui && state.ui.uiloading,
    profile: state.profile,
    isNavOpen: state.ui && state.ui.isNavOpen,
    errorModalloading: _.get(state, ['errorReducer', 'errorModalloading']),
  };
};

export default connect(mapStateToProps, {})(Home);
