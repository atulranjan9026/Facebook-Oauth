import React, { useState, useEffect } from "react";
import { auth, provider } from "./firebase";
import { FacebookAuthProvider,signInWithPopup } from "firebase/auth"; 
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(""); 
  const [pageData, setPageData] = useState({});
  const [accessToken, setAccessToken] = useState(null);
  const [since, setSince] = useState("");
  const [until, setUntil] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [photoURL, setPhotoURL] = useState("");

  useEffect(() => {
    const loadFacebookSDK = () => {
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: "3829423940680629",
          cookie: true,
          xfbml: true,
          version: "v20.0",
        });
      };
    
      (function (d, s, id) {
        var js,
          fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
          return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";

        fjs.parentNode.insertBefore(js, fjs);
      })(document, "script", "facebook-jssdk");
    };
    
    loadFacebookSDK();
  }, []);

  const handleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        setUser({ name: user.displayName });
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const uid = user.providerData.length > 0 ? user.providerData[0].uid : null;
        const token = credential ? credential.accessToken : null;
        console.log("Access Token:", token);
        const photoURL = `https://graph.facebook.com/${uid}/picture?type=large&access_token=${token}`;
        
        setPhotoURL(photoURL);
        setAccessToken(token);

        fetchPages(token);
      })
      .catch((error) => {
        console.error("Error during login:", error);
        setError("Failed to login. Please try again.");
      });
  };

  const fetchPages = (token) => {
  window.FB.api(
    "/me/accounts",
    { access_token: token },
    function (response) {
      if (response && !response.error) {
        setPages(response.data);
      } else {
        setError("Failed to fetch pages. Please try again.");
      }
    }
  );
};
  const handlePageSelect = (event) => {
    const pageId = event.target.value;
    setSelectedPage(pageId); 
    if (pageId && accessToken) {
      fetchPageData(pageId, accessToken);
    }
  };

  const fetchPageData = (pageId, token) => {
    setIsLoading(true);
  
    const params = {
      access_token: token,
      period: "total_over_range",
      since: since,
      until: until,
    };
    console.log("pageId:", pageId)
    console.log("params:", params)
  
    window.FB.api(
      `/${pageId}/insights?metric=page_impressions,page_engagement,page_fan_adds,page_reactions`,
      params,
      function (response) {
        setIsLoading(false);
        if (response && !response.error) {
          const data = response.data.reduce((acc, item) => {
            acc[item.name] = item.values[0].value;
            return acc;
          }, {});
          setPageData(data);
        } else {
          console.error("Error fetching page insights:", response.error);
          setError("Failed to fetch page insights. Please try again.");
        }
      }
    );
    
  };

  return (
    <div className="App">
      {user ? (
        <div>
          <h1>Welcome, {user.name}</h1>
          <img src={photoURL} alt="Profile" />

          <div>
            <label>Since: </label>
            <input
              type="date"
              value={since}
              onChange={(e) => setSince(e.target.value)}
            />
            <label>Until: </label>
            <input
              type="date"
              value={until}
              onChange={(e) => setUntil(e.target.value)}
            />
          </div>

          {pages.length > 0 ? (
            <select onChange={handlePageSelect} value={selectedPage || ""}>
              {/* Ensures the value is an empty string instead of null */}
              <option value="">Select a Page</option>
              {pages.map((page) => (
                <option key={page.id} value={page.id}>
                  {page.name}
                </option>
              ))}
            </select>
          ) : (
            <p>No pages found or failed to fetch pages.</p>
          )}

          {isLoading && <p>Loading data...</p>}
          {pageData && (
            <div className="cards-container">
              <Card
                title="Total Followers / Fans"
                value={pageData.page_fan_adds || 0}
              />
              <Card
                title="Total Engagement"
                value={pageData.page_engagement || 0}
              />
              <Card
                title="Total Impressions"
                value={pageData.page_impressions || 0}
              />
              <Card
                title="Total Reactions"
                value={pageData.page_reactions || 0}
              />
            </div>
          )}

          {error && <p className="error">{error}</p>}
        </div>
      ) : (
        <div>
          <button onClick={handleLogin}>Login with Facebook</button>
          {error && <p className="error">{error}</p>}
        </div>
      )}
    </div>
  );
}

const Card = ({ title, value }) => {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
};

export default App;
