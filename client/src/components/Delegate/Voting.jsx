import React, { useState } from 'react';
import '../../styling/Voting.css';
import { navigate } from '@reach/router';
import { useMutation } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import Navbar from '../Common/Navbar';
import LoadingScreen from '../Common/LoadingScreen';
import { VOTE } from '../../typedefs';

const Voting = props => {
  const { location } = props;
  const { data } = location.state;
  const initial = {
    pollId: data.pollId,
    type: data.votingType,
    title: data.title,
    description: data.description,
    total_speaker_time: data.totalSpeakerTime,
  };
  const [vote] = useState(initial);
  const [renderButton] = useState(true);
  const [selected, setSelected] = useState(null);

  const [voteMutation, { loading, error }] = useMutation(VOTE, {
    onCompleted() {
      navigate('/result', {
        state: { data: { vote: vote ? 1 : 0, pollId: vote.pollId } },
      });
    },
  });
  if (loading) return <LoadingScreen />;
  if (error) return <p>An error occurred</p>;

  const handleVote = () => {
    voteMutation({ variables: { pollId: vote.pollId, vote: selected } });
  };

  const getButtons = () => {
    let buttonYes = (
      <button
        onClick={() => setSelected(true)}
        className="pollBtn"
        type="button"
      >
        YES
      </button>
    );
    let buttonNo = (
      <button
        onClick={() => setSelected(false)}
        className="pollBtn"
        type="button"
      >
        NO
      </button>
    );

    if (selected) {
      buttonYes = (
        <button
          onClick={() => setSelected(true)}
          className="pollBtn selected"
          type="button"
        >
          YES
        </button>
      );
      buttonNo = (
        <button
          onClick={() => setSelected(false)}
          className="pollBtn notSelected"
          type="button"
        >
          NO
        </button>
      );
    }

    if (selected === false) {
      buttonYes = (
        <button
          onClick={() => setSelected(true)}
          className="pollBtn notSelected"
          type="button"
        >
          YES
        </button>
      );
      buttonNo = (
        <button
          onClick={() => setSelected(false)}
          className="pollBtn selected"
          type="button"
        >
          NO
        </button>
      );
    }

    return (
      <div className="votingButtons">
        <div className="voteYes">{buttonYes}</div>
        <div className="voteNo">{buttonNo}</div>
      </div>
    );
  };

  const proceed = () => {
    if (selected != null) {
      return (
        <button onClick={handleVote} className="proceedBtn" type="button">
          Vote
        </button>
      );
    }
    return null;
  };

  return (
    <div className="container">
      <Navbar />
      <div className="heading">
        <h1 className="headingText">Delegate Voting</h1>
      </div>
      <div className="pollInfo">
        <div className="pollBox pollTitle">
          <h1 className="labelHeading">TITLE:</h1>
          <h1 className="pollDetail">{vote.title}</h1>
        </div>
        <div className="pollBox pollTitle">
          <h1 className="labelHeading">Description:</h1>
          <h1 className="pollDetail">{vote.description}</h1>
        </div>
        <div className="pollBox pollSpeakerTime">
          <h1 className="labelHeading">TOTAL SPEAKER TIME:</h1>
          <h1 className="pollDetail">{vote.total_speaker_time} minutes</h1>
        </div>
      </div>
      <div className="proceed">{proceed()}</div>
      {renderButton && getButtons()}
    </div>
  );
};

Voting.propTypes = {
  location: PropTypes.instanceOf(Object).isRequired,
};

export default Voting;
