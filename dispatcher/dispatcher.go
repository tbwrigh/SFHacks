package main

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
)

func main() {
	http.HandleFunc("/", handler)
	http.ListenAndServe(":8080", nil)
}

func handler(w http.ResponseWriter, r *http.Request) {
	// Parse the URL
	url, err := url.Parse("http://localhost:5173")
	if err != nil {
		log.Fatal(err)
	}

	// Create the reverse proxy
	proxy := httputil.NewSingleHostReverseProxy(url)

	// Update the headers to allow for SSL redirection
	r.Header.Set("X-Forwarded-Host", r.Host)
	r.Header.Set("X-Forwarded-Server", r.Host)
	r.Header.Set("X-Forwarded-For", r.RemoteAddr)

	// Note that ServeHttp is non blocking and uses a go routine under the hood
	proxy.ServeHTTP(w, r)
}
