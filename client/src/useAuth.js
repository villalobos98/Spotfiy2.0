import { useState, useEffect } from "react"
import axios from "axios"

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState()
  const [refreshToken, setRefreshToken] = useState()
  const [expiresIn, setExpiresIn] = useState()


  useEffect(() => {
    axios.post("http://localhost:1334/login", {
      code,
    }).then(serverResponse => {
      setAccessToken(serverResponse.data.accessToken)
      setRefreshToken(serverResponse.data.refreshToken)
      setExpiresIn(serverResponse.data.expiresIn)
      window.history.pushState({}, null, "/")
    }).catch((err) => {
      console.log(err)
      window.location = "/"
    })
  }, [code])

  useEffect(() => {
    if (!refreshToken || !expiresIn) return
    const interval = setInterval(() => {
      axios
        .post("http://localhost:1334/refresh", {
          refreshToken,
        })
        .then(serverResponse => {
          setAccessToken(serverResponse.data.accessToken)
          setExpiresIn(serverResponse.data.expiresIn)
        })
        .catch(() => {
          window.location = "/"
        })
    }, (expiresIn - 60) * 1000)

    return () => clearInterval(interval)
  }, [refreshToken, expiresIn])

  return accessToken
}
