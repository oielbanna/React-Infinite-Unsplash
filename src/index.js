import { render } from "react-dom";
import React, { useState, useEffect } from "react";
import useMeasure from "./useMeasure";
import useMedia from "./useMedia";
import "./styles.css";
import InlineEdit from "./components/text-editor.jsx";
import Image from "./components/image.js";

const Unsplash = require("unsplash-js").default;
const toJson = require("unsplash-js").toJson;

const unsplash = new Unsplash({
  applicationId:
    "967e6889f2e929c8a9fd640942afe01c3d1f7eee50e31b75f146877406a3ec07",
  secret: "0e068fc9afca3138a8453e1c4ad4627fcb21a42c7f59a0adef54d10b4eca471c"
});

function App() {
  // Tie media queries to the number of columns
  const columns = useMedia(
    ["(min-width: 1500px)", "(min-width: 1000px)", "(min-width: 600px)"],
    [5, 4, 3],
    2
  );
  let heights = new Array(columns).fill(0); // Each column gets a height starting with zero

  // Measure the width of the container element
  const [bind, { width }] = useMeasure();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("FLORENCE");

  async function fetchData() {
    console.log(items.length);
    await unsplash.search
      .photos(search, 1, Math.max(items.length + 10, 20))
      .then(toJson)
      .then(json => {
        console.log("USING: ", search);
        let result = json.results.map((item, i) => {
          const column = heights.indexOf(Math.min(...heights)); // Basic masonry-grid placing, puts tile into the smallest column using Math.min
          const x = (width / columns) * column;
          const y = (heights[column] += item.height / 8) - item.height / 8;
          return {
            css: `url(${item.urls.raw})`,
            height: item.height / 8,
            x,
            y,
            width: width / columns
          };
        });

        setItems(result);
      });
  }
  useEffect(() => {
    fetchData();
  }, [search, setItems, width]);

  // TODO: saving this to make infinite scroll later
  // useEffect(() => {
  //   var d = document.documentElement;
  //   var offset = d.scrollTop + window.innerHeight;
  //   var height = d.offsetHeight;

  //   console.log("offset = " + offset);
  //   console.log("height = " + height);

  //   if (offset >= height) {
  //     console.log("At the bottom");
  //   }
  // }, [window.onscroll]);
  return (
    <>
      <InlineEdit
        activeClassName="editing"
        text={search}
        paramName="message"
        change={i => {
          setSearch(i.message);
        }}
        style={{
          backgroundColor: "yellow",
          minWidth: 150,
          display: "inline-block",
          margin: 0,
          padding: 0,
          fontSize: 45,
          outline: 0,
          border: 0,
          textTransform: "uppercase"
        }}
      />
      <p
        style={{ letterSpacing: 0, margin: 6, color: "#ababab", fontSize: 14 }}
      >
        Click the title to search
      </p>
      <div {...bind} className="list" style={{ height: Math.max(...heights) }}>
        {items.map((item, key) => (
          <Image
            id={key}
            style={{
              transform: `translate3d(${item.x}px,${item.y}px,0)`,
              width: item.width,
              height: item.height,
              opacity: 1
            }}
            css={item.css}
          />
        ))}
      </div>
    </>
  );
}

render(<App />, document.getElementById("root"));
