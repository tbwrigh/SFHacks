package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"strconv"
	"strings"

	_ "github.com/lib/pq"
)

var conn *sql.DB = nil
var subdomains = make(map[string]struct{})
var base_host string
var control_url string
var instance_url string

func main() {
	base_host = os.Getenv("BASE_HOST")

	control_url = os.Getenv("CONTROL_URL")
	instance_url = os.Getenv("INSTANCE_URL")

	host := os.Getenv("DB_HOST")
	port, err := strconv.Atoi(os.Getenv("DB_PORT"))
	if err != nil {
		panic(err)
	}
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")

	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	conn, err = sql.Open("postgres", psqlInfo)
	if err != nil {
		panic(err)
	}
	defer conn.Close()

	http.HandleFunc("/", handler)
	http.ListenAndServe(":8080", nil)
}

func getSubdomains() []string {
	rows, err := conn.Query("SELECT subdomain FROM courses")
	if err != nil {
		panic(err)
	}
	defer rows.Close()

	hosts := make([]string, 0)
	for rows.Next() {
		var host string
		err := rows.Scan(&host)
		if err != nil {
			panic(err)
		}
		hosts = append(hosts, host)
	}
	err = rows.Err()
	if err != nil {
		panic(err)
	}
	return hosts
}

func handler(w http.ResponseWriter, r *http.Request) {
	var url_str string

	if !strings.HasSuffix(r.Host, "."+base_host) {
		// print r.Host
		fmt.Println("control")
		fmt.Println(r.Host)

		url_str = control_url
	} else {
		// print r.Host
		fmt.Println("instance")
		fmt.Println(r.Host)

		url_str = instance_url

		// print host
		subdomain := strings.TrimSuffix(r.Host, "."+base_host)

		if _, okay := subdomains[subdomain]; !okay {
			s := getSubdomains()
			for _, ss := range s {
				subdomains[ss] = struct{}{}
			}
			if _, okay := subdomains[subdomain]; !okay {
				http.Redirect(w, r, "http://"+base_host+"/404", http.StatusTemporaryRedirect)
				return
			}
		}

		r.Header.Set("Client-Name", subdomain)
	}

	// Parse the URL
	url, err := url.Parse(url_str)
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
