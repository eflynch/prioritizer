export type Decision = {
    a:string;
    b:string;
  };
  
export type Ballot = {
    decision:Decision;
    choice:"a"|"b"
  };