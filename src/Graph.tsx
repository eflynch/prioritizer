import './Graph.css';
import { Ballot, Decision } from './Types';

import GraphInternal from 'react-graph-vis';
import { useEffect, useState } from 'react';

const uuid = () => {
    return crypto.randomUUID();
}

type Link = {
    from:number,
    to:number,
    id:string
}

function Graph(props:{ballots:Ballot[]}) {
    let nodes:string[] = [];
    let edges:Map<string, number> = new Map<string, number>();
    props.ballots.forEach((ballot:Ballot)=>{
        if (nodes.indexOf(ballot.decision.a) === -1) {
            nodes.push(ballot.decision.a);
        }
        if (nodes.indexOf(ballot.decision.b) === -1) {
            nodes.push(ballot.decision.b);
        }
        const decisionKey = ballot.decision.a + "-" + ballot.decision.b;
        const value = ballot.choice === "a" ? 1 : -1;
        edges.set(decisionKey, (edges.get(decisionKey)||0) + value);
    });
    let links:Link[] = [];
    edges.forEach((value, key)=>{
        const [a, b] = key.split("-");
        links.push({
            from: nodes.indexOf((value > 0 ? a : b)),
            to: nodes.indexOf((value > 0 ? b : a)),
            id: key,
        });
    });

    const graphData = {
        nodes:nodes.map((node:string, index)=>{
            return {
                label:node,
                id:index,
            }
        }),
        edges:links
    };

    const [graphID, setGraphID] = useState<string>(uuid());
    useEffect(()=>{
        setGraphID(uuid());
    }, [props.ballots]);

    const options = {
        layout: {
          hierarchical: {
            enabled: true,
            sortMethod: "directed",
            shakeTowards:"leaves"
          } 
        },
        edges: {
          color: "#000000"
        },
        nodes: {
            color: {
                background: "white",
                border: "black"
            }, 
            borderWidth: 1,
        },
        height: "500px"
      };
    
    return (
        <GraphInternal key={graphID} graph={graphData} options={options} />
    )
}

export default Graph;
