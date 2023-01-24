import {
  useCallback,
  useDeferredValue,
  useEffect,
  useId,
  useState,
} from "react";

import { HomeContext } from "context";
import { getPoints, getTransactions, getUsers } from "mockAPIs";
import {
  AddTransaction,
  MonthlyStats,
  TransactionStats,
  UserList,
} from "components";

import styles from "./index.module.scss";

export function Home() {
  // States
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [pointsTable, setPointsTable] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  // Constants
  const searchId = useId();
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    Promise.all([getUsers(), getTransactions(), getPoints()])
      .then(([_users, _transactions, _userPoints]) => {
        // Considering them to be formatted
        setUsers(_users);
        setTransactions(_transactions);
        setPointsTable(_userPoints);
      })
      .catch((userErr, transactionErr, pointErr) => {
        const err = userErr || transactionErr || pointErr;
        setError(typeof err === "string" ? err : err?.message);
      });
  }, []);

  useEffect(() => {
    getPoints(deferredSearch)
      .then((_users) => setUsers(_users))
      .catch((err) => setError(typeof err === "string" ? err : err?.message));
  }, [deferredSearch]);

  const handleActiveUserClick = useCallback(
    (user) => {
      setActiveUser(user);
    },
    [setActiveUser]
  );

  const handleUserSearch = (event) => {
    const { value } = event.target;

    setSearch(value);
  };

  return (
    <HomeContext.Provider
      value={{
        users,
        transactions,
        pointsTable: pointsTable,
        activeUser,
        handleActiveUserClick,
      }}
    >
      {error && (
        <div className={styles["error_container"]}>
          <h1>It's not you. It's us. Give it another try, please {error}</h1>
        </div>
      )}
      <div className={styles["home-container"]}>
        <div className={styles["search__container"]}>
          <label htmlFor={searchId}>Search User</label>
          <input
            type="text"
            name="username"
            placeholder="Search user by name"
            id={searchId}
            value={search}
            onChange={handleUserSearch}
          />
        </div>
        <div className={styles["users__container"]}>
          <UserList />
          <MonthlyStats />
        </div>
        <div className={styles["transactions__list__container"]}>
          <TransactionStats />
        </div>
        <div className={styles["add__transactions__container"]}>
          <AddTransaction />
        </div>
        <div className={styles["month__stats__container"]}></div>
      </div>
    </HomeContext.Provider>
  );
}
