import { useState, useEffect, useRef } from "react";
import "./App.css";

export default function App() {
  const [data, setData] = useState([]);
  const [username, setUsername] = useState("");
  const [repoFilter, setRepoFilter] = useState("");
  const memoData = useRef("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    console.log("LOADING", loading);
  }, [loading]);

  const getData = () => {
    if (username.length) {
      setLoading(true);
      setError("");
      fetch(`https://api.github.com/users/${username}/repos`)
        .then((data) => data.json())
        .then((data) => {
          memoData.current = data;
          console.log(data);
          setData(data);
          setFilteredData(data);
        })
        .then(() => setLoading(false));
    } else {
      setError("enter a username to search repos");
    }
  };

  useEffect(() => {
    console.log("search string", repoFilter);
    setError("");
    if (memoData.current.length) {
      const x = memoData.current?.filter((item) => {
        return item?.name.includes(repoFilter);
      });
      console.log(x.length);
      if (x.length) {
        setData(x);
      } else {
        setData([]);
        setError("No data for filter " + repoFilter);
        // setData(memoData.current);
      }
    }
  }, [repoFilter]);

  const Repo = ({ data, index }) => {
    // console.log("PROPS", data);
    return (
      <tr>
        <td>{index + 1}</td>
        <td>{data.name || "-"}</td>
        <td>{data.description || "-"}</td>
        <td>{data.forks_count}</td>
        <td>{data.watchers}</td>
      </tr>
    );
  };

  return (
    <div className="container">
      <h1>
        <u>GitHub Repository Search</u>
      </h1>
      <div className="search-input">
        <div className="search-div">
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => e.target.value && setUsername(e.target.value)}
          />
          <input type="submit" name="submit" onClick={getData} />
        </div>
      </div>
      {!loading ? (
        <>
          {error && <p className="error-message">{error}</p>}
          <div>
            {memoData.current.length ? (
              <div>
                <div className="result-header">
                  <h4 className="repo-num">
                    Number of Repo's:
                    <span>{data.length}</span>
                  </h4>
                  <div className="filter">
                    <p>Filter repos based on name</p>
                    <input
                      type="text"
                      placeholder="start typing..."
                      onChange={(e) => {
                        if (e.target.value.length) {
                          setRepoFilter(e.target.value);
                        } else {
                          setRepoFilter("");
                          console.log("RESETTING DATAA TO MEMO", memoData);
                          setData(memoData.current);
                        }
                      }}
                    />
                  </div>
                </div>
                <table>
                  <tr className="table-head">
                    <th>Sno.</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Forks_count</th>
                    <th>Watchers</th>
                  </tr>
                  {data.map((d, index) => {
                    return <Repo data={d} key={d.id} index={index} />;
                  })}
                </table>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </>
      ) : (
        <h4>Loading</h4>
      )}
    </div>
  );
}
