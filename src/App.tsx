import { useEffect, useState } from "react";

export function App() {
  const [message, setMessage] = useState("checking /health");

  useEffect(() => {
    fetch("/health")
      .then((response) => {
        if (response.status === 200) {
          setMessage("200 success");
          return;
        }
        setMessage(String(response.status));
      })
      .catch(() => {
        setMessage("health check failed");
      });
  }, []);

  return <main>{message}</main>;
}
