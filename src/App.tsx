import React, { useCallback, useEffect, useState } from 'react';
import { useLocalStorage } from 'react-use';
import update from 'immutability-helper';
import './App.css';
import Graph from './Graph';
import { Ballot, Decision } from './Types';

function randomInt(max:number) {
  return Math.floor(Math.random() * max);
}


function Options(props:any) {
  return (
    <div>
      {props.options.map((option:string, i:number)=>{
        return (
          <div key={i}>
            <b onClick={()=>{
              const newOptions = update(props.options, {$splice: [[i, 1]]});
              props.newOptions(newOptions);
              }}>x </b>
            <input type="text" defaultValue={option} onChange={(e:any)=>{
            props.newOptions(update(props.options, {[i]: {$set: e.currentTarget.value}}));
          }} />
          </div>
        );
    })}
      <button onClick={()=>{
        props.newOptions(update(props.options, {$push: [""]}));
      }}>+</button>
    </div>
  )
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

const generateDecision = (options:string[]) => {
  const aIndex = randomInt(options.length)
  let bIndex = undefined;
  while(bIndex == undefined) {
    const possibleBIndex = randomInt(options.length)
    if (possibleBIndex !== aIndex) {
      bIndex = possibleBIndex; 
    }
  }
  return {
    a:options[aIndex < bIndex ? aIndex : bIndex],
    b:options[aIndex < bIndex ? bIndex : aIndex]
  }
};

function App() {
  const [options, setOptions] = useLocalStorage<string[]>("options1", OPTIONS);
  const [ballotsCast, setBallotsCast] = useLocalStorage<Ballot[]>("ballots", []);
  const [decision, setDecision] = useState<Decision|null>(generateDecision(options));
  const [showResults, setShowResults] = useLocalStorage<boolean>("showResults", true);

  const clearBallots = () =>{
    setBallotsCast([]);
  };

  const newDecision = (options:string[]) => {
    setDecision(generateDecision(options));
  }

  const castBallot = (ballot:Ballot) => {
    setBallotsCast((()=>{
      return update(ballotsCast, {$push: [ballot]});
    })());
    newDecision(options);
  }; 

  const newOptions = (options:string[]) => {
    if (options.length < 2) {
      return;
    }
    setOptions(options);
    clearBallots();
    newDecision(options);
  };

  return (
    <div className="App">
      <header>
        Prioritizer
      </header>
      {decision ? <DecisionMaker decision={decision} castBallot={castBallot}/> : <></>}
      <button onClick={clearBallots}>clear</button>
      <button onClick={()=>{setShowResults(!showResults)}}>{showResults ? "show options" : "show results"}</button>
      {showResults ?
        <ShowResults ballotsCast={ballotsCast}/> :
        <Options options={options} newOptions={newOptions} />}
    </div>
  );
}

export default App;
