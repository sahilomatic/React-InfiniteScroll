import { useCallback, useRef, useState } from "react";
import InfiniteRender from "./components/InfiniteRender";

export default function App() {
  const [query, setQuery] = useState("");
  const [listData, setListData] = useState([]);
  const [isLoading, setLoadaing] = useState(true);
  const observer = useRef(null);

  const showData = useCallback((item, key, ref) => {
    return (
      <div key={key} ref={ref}>
        <h4>{item}</h4>
      </div>
    );
  }, []);

  const getData = useCallback((page, query) => {
    console.log(page);
    return new Promise(async (resolve, reject) => {
      try {
        if (observer.current) {
          observer.current.abort();
        }
        observer.current = new AbortController();
        let res = await fetch(
          "https://openlibrary.org/search.json?" +
            new URLSearchParams({
              q: query,
              page: page,
            }),
          {
            signal: observer.current.signal,
          }
        );

        let data1 = await res.json();
        console.log(data1.docs);
        setLoadaing(false);
        setListData(listData.concat(data1.docs));

        resolve(data1.docs);
      } catch (e) {
        reject(e);
      }
    });
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    setLoadaing(true);
    setQuery(e.target.value);
    //getData(1, query);
  };

  return (
    <div>
      <div>
        <input
          type="text"
          onChange={(e) => {
            handleChange(e);
          }}
          value={query}
        />
      </div>

      <div>
        <InfiniteRender
          showData={showData}
          getData={getData}
          query={query}
          listData={listData}
          isLoading={isLoading}
          setLoadaing={setLoadaing}
        />
      </div>
    </div>
  );
}
