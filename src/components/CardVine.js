// React component
import React from 'react';

const CardVine = (props) => {
  return (
    <div className="cardvine cardvine-border cardvine-border-vertical">
    {props.children}
  </div>
  );
}

export default CardVine;
