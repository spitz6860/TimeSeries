package main

import (
	"encoding/json"
	"log"
	"math/rand"
	"net/http"
	"github.com/gorilla/mux"
)

type TimeSeries struct {
	UsageData	[]float64
	Total		float64
	Unit		string
}

type Route struct {
	Name		string
	Method		string
	Pattern		string
	HandlerFunc http.HandlerFunc
}

type Routes []Route

var routes = Routes{
	Route{
		"CPU",
		"GET",
		"/api/cpu/{timespan}/{interval}",
		GenerateCpuData,
	},
	Route{
		"Memory",
		"GET",
		"/api/memory/{timespan}/{interval}",
		GenerateMemoryData,
	},
	Route{
		"HDD",
		"GET",
		"/api/hdd/{timespan}/{interval}",
		GenerateHddData,
	},
	Route{
		"Network",
		"GET",
		"/api/network/{timespan}/{interval}",
		GenerateNetworkData,
	},
}


func main() {

	router := NewRouter()

	log.Fatal(http.ListenAndServe(":8080", router))
}

func NewRouter() *mux.Router {
	router := mux.NewRouter().StrictSlash(true)
	for _, route := range routes {
		var handler http.Handler
		handler = route.HandlerFunc

		router.
			Methods(route.Method).
			Path(route.Pattern).
			Name(route.Name).
			Handler(handler)

	}

	router.PathPrefix("/").Handler(http.FileServer(http.Dir("./chart/")))
	return router
}

func GenerateCpuData(w http.ResponseWriter, r *http.Request) {
	GenerateRandomData(w, r, 100, "%")
}

func GenerateMemoryData(w http.ResponseWriter, r *http.Request) {
	GenerateRandomData(w, r, 16, "GB")
}

func GenerateHddData(w http.ResponseWriter, r *http.Request) {
	GenerateIncreasingData(w, r, 720, "GB")
}

func GenerateNetworkData(w http.ResponseWriter, r *http.Request) {
	GenerateIncreasingData(w, r, 50, "GB")
}

func GenerateRandomData(w http.ResponseWriter, r *http.Request, max float64, unit string) {
	vars := mux.Vars(r)
	
	dataAmount := CalcTimes(vars["timespan"], vars["interval"])

	var instances []float64

	for i:=0; i < dataAmount; i++ {
		instances = append(instances, twoDecimal(rand.Float64() * max))
	}
	timeseries := TimeSeries{instances, max, unit}

	OutputJson(w, timeseries)
}

func GenerateIncreasingData(w http.ResponseWriter, r *http.Request, max float64, unit string) {
	vars := mux.Vars(r)
	
	dataAmount := CalcTimes(vars["timespan"], vars["interval"])

	var instances []float64
	instances = append(instances, twoDecimal(rand.Float64() * max))
	for i:=1; i < dataAmount; i++ {
		randomData := rand.Float64() * max / float64(dataAmount) + instances[i-1]
		if randomData >= max {
			randomData = max
		}
		instances = append(instances, twoDecimal(randomData))
	}
	timeseries := TimeSeries{instances, max, unit}

	OutputJson(w, timeseries)
}

func CalcTimes(timespanStr string, intervalStr string) int {
	var interval, timespan int
	switch intervalStr {
		case "12h":
			interval = 720
		case "6h":
			interval = 360
		case "4h":
			interval = 240
		case "2h": 
			interval = 120
		case "1h":
			interval = 60
		case "10m":
			interval = 10
		case "5m":
			interval = 5
		case "2m":
			interval = 2
		default: 
			interval = 1440
	}

	switch timespanStr {
		case "day":
			timespan = 1440
		case "hour":
			timespan = 60
		default:
			timespan = 10080
	}
	return timespan/interval + 1
}

func OutputJson(w http.ResponseWriter, data TimeSeries) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(data); err != nil {
		panic(err)
	}
}

func twoDecimal(k float64) float64 {
	return float64(int(k * 100)) / 100;
}