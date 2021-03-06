import React from 'react';
import '../../styling/DelegateLanding.css';
import { navigate } from '@reach/router';
import { useApolloClient, useSubscription } from '@apollo/react-hooks';
import { POLL_DETAILS } from '../../subscriptions';

function DelegateLanding() {
  const client = useApolloClient();

  useSubscription(POLL_DETAILS, {
    shouldResubscribe: true,
    fetchPolicy: 'network-only',
    onSubscriptionData: options => {
      console.log(options.subscriptionData.data);
      if (
        options.subscriptionData.data.pollDetails.username.indexOf(
          localStorage.getItem('userName')
        ) > -1
      ) {
        navigate('result', {
          state: {
            data: { pollId: options.subscriptionData.data.pollDetails.pollId },
          },
        });
      } else {
        navigate('vote', {
          state: { data: options.subscriptionData.data.pollDetails },
        });
      }
    },
  });

  const logout = event => {
    event.preventDefault();
    client.writeData({
      data: {
        isLoggedIn: null,
        userType: null,
      },
    });
    localStorage.clear();
  };

  return (
    <>
      <button type="button" onClick={logout} className="logout">
        Logout
      </button>
      <p className="title">WELCOME DELEGATE !</p>
      <div className="councilContainer">
        <div className="councilLogo">
          <img
            src="Logos/Square/Arab-01.png"
            alt="councilLogo"
            height="300"
            width="300"
          />
        </div>
        <div className="countryFlag">
          <img
            src="square/iran.webp"
            alt="countryFlag"
            height="250"
            width="450"
          />
        </div>
      </div>
      <div className="logo">
        <img src="Logos/mun.png" alt="logo" height="200" width="auto" />
      </div>
    </>
  );
}

export default DelegateLanding;
