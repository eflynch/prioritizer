import React, { useState } from 'react';
import { useSessionStorage } from 'react-use';
import update from 'immutability-helper';
import './App.css';
import Graph from './Graph';
import { Ballot, Decision } from './Types';

function randomInt(max:number) {
  return Math.floor(Math.random() * max);
}


function DecisionMaker(props:any) {
  return (
    <div className="Decision">
      <span>Do You Prefer...</span>
      <button onClick={()=>{
        props.castBallot({decision:props.decision, choice:"a"});
      }}>{props.decision.a}</button>
      <span>OR</span>
      <button onClick={()=>{
        props.castBallot({decision:props.decision, choice:"b"});
      }}>{props.decision.b}</button>
    </div>
  );
}

function ShowResults(props:any) {
  return (
    <div className="Results">
      <div>
        <Graph ballots={props.ballotsCast} />
      </div>
      <button onClick={props.clearGraph}>clear</button>
    </div>
  )
}

const OPTIONS = [
  'Health',
  'Sex',
  'Family',
  'Community',
  'Work',
  'Being Social',
  'Solitude',
  'Intellectual Activity',
  'Physical Activity',
  'Creative Activity',
  'Freedom from Stress',
  'Quality of Time',
  'Security',
  'Connection with Nature',
  'Climate',
  'Higher Purpose',
  'Prestige/Recognition',
  'Excitement/Variety',
  'Education',
  'Ingenuity',
  'Children',
  'Integrity',
  'Appearance',
  'Pleasure',
  'Romance',
  'Ownership',
  'Money',
  'Religion',
  'Roots/Tradition',
  'Relaxation',
  'Comfort/Ease'
]

const generateDecision = () => {
  const aIndex = randomInt(OPTIONS.length)
  let bIndex = undefined;
  while(bIndex == undefined) {
    const possibleBIndex = randomInt(OPTIONS.length)
    if (possibleBIndex !== aIndex) {
      bIndex = possibleBIndex; 
    }
  }
  return {
    a:OPTIONS[aIndex < bIndex ? aIndex : bIndex],
    b:OPTIONS[aIndex < bIndex ? bIndex : aIndex]
  }
};

function App() {
  const [ballotsCast, setBallotsCast] = useSessionStorage<Ballot[]>("ballots", []);
  const [decision, setDecision] = useState<Decision|null>(generateDecision());
  const [showResults, setShowResults] = useState<boolean>(true);

  const clearBallots = () =>{
    setBallotsCast([]);
  };

  const newDecision = () => {
    setDecision(generateDecision());
  }

  const castBallot = (ballot:Ballot) => {
    setBallotsCast((()=>{
      return update(ballotsCast, {$push: [ballot]});
    })());
    newDecision();
  };



  return (
    <div className="App">
      <header>
        Prioritizer
      </header>
      {decision ? <DecisionMaker decision={decision} castBallot={castBallot}/> : <></>}
      {showResults ? <ShowResults ballotsCast={ballotsCast} clearGraph={clearBallots}/> : <></>}
    </div>
  );
}

export default App;
