import React, { useEffect, useState } from 'react';
import { useLocalStorage } from 'react-use';
import update from 'immutability-helper';
import './App.css';
import Graph from './Graph';
import { Ballot, Decision } from './Types';

function randomInt(max:number) {
  return Math.floor(Math.random() * max);
}


function DecisionMaker(props:any) {

  useEffect(()=>{
    const handler = event => {
      if (event.key === "a") {
        props.castBallot({decision:props.decision, choice:"a"});  
      }
      if (event.key === "b") {
        props.castBallot({decision:props.decision, choice:"b"});
      }
    };
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    }
  });

  return (
    <div className="Decision">
      <span>Which is more important...</span>
      <button onClick={()=>{
        props.castBallot({decision:props.decision, choice:"a"});
      }}>A: {props.decision.a}</button>
      <span>OR</span>
      <button onClick={()=>{
        props.castBallot({decision:props.decision, choice:"b"});
      }}>B: {props.decision.b}</button>
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
  'Occupation',
  'Being Social',
  'Solitude',
  'Intellectual Activity',
  'Physical Activity',
  'Creative Activity',
  'Peace',
  'Productivity',
  'Security',
  'Nature',
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
  'Owning Things',
  'Money',
  'Religion',
  'Roots/Tradition',
  'Relaxation',
  'Physical Comfort'
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
  const [ballotsCast, setBallotsCast] = useLocalStorage<Ballot[]>("ballots", []);
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
