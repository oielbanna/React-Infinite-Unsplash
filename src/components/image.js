import React from "react";

export default function Image(props) {
  return (
    <div
      key={props.id}
      style={{
        ...props.style
      }}
    >
      <div style={{ backgroundImage: props.css }} />
    </div>
  );
}
