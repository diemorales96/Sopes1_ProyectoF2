package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"

	pb "github.com/racarlosdavid/demo-gRPC/proto"
	"google.golang.org/grpc"
)

type GameBody struct {
	GameId  string `json:"game_id"`
	Players string `json:"players"`
}

func IndexHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("API GO - gRPC Client!\n"))
}

func execGame(w http.ResponseWriter, r *http.Request) {
	var x GameBody
	err := json.NewDecoder(r.Body).Decode(&x)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	fmt.Println("Game Body: ", x)
	/********************************** gRPC llamada al servidor ********************************/
	conn, err := grpc.Dial("localhost:50051", grpc.WithInsecure(), grpc.WithBlock())
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	defer conn.Close()
	c := pb.NewJuegosClient(conn)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()
	reply, err := c.addLog(ctx, &pb.JuegoRequest{
		game_id: x.GameId,
		players: x.Players,
	})
	if err != nil {
		log.Fatalf("could not greet: %v", err)
	}
	/********************************** gRPC ********************************/

	/********************************** Respuesta ********************************/
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	json.NewEncoder(w).Encode(struct {
		Mensaje string `json:"mensaje"`
	}{Mensaje: reply.GetMessage()})
}

func main() {
	router := mux.NewRouter().StrictSlash(false)
	router.HandleFunc("/", IndexHandler)
	router.HandleFunc("/exec-game", execGame).Methods("POST")
	log.Println("Listening at port 2000")
	log.Fatal(http.ListenAndServe(":2000", router))
}
