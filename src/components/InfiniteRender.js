import { useEffect, useState, useRef, useCallback } from "react";

export default function InfiniteRender(props) {
  const [page, setPage] = useState(1);
  const observer = useRef(null); // we can not use ref because it is not part of state and won't rerender component everytime state changes
  const { getData, query, showData, listData, isLoading } = props;
  console.log("InfiniteRender", listData.length);
  const lastElementObserver = useCallback(
    (node) => {
      if (isLoading) {
        return;
      }
      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevpage) => prevpage + 1);
        }
      });

      observer.current.observe(node);
    },
    [isLoading]
  );

  const renderList = () => {
    return listData.map((obj, index) => {
      if (index == listData.length - 1) {
        return <div>{showData(obj.title, index, lastElementObserver)}</div>;
      } else {
        return <div>{showData(obj.title, index, null)}</div>;
      }
    });
  };
  useEffect(() => {
    console.log("here");
    let listData1 = getData(page, query);
    console.log(listData1);
  }, [query, page]);

  return (
    <div>
      <h2>List Data</h2>

      {isLoading ? "Loading..." : renderList()}
    </div>
  );
}
