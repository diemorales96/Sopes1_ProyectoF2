package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net"
	"os"

	"github.com/confluentinc/confluent-kafka-go/kafka"
	pb "github.com/diemorales96/Sopes1_ProyectoF2/proto"

	"google.golang.org/grpc"
)

type server struct {
	pb.UnimplementedJuegosServer
}
type GameResult struct {
	Game_id       int32  `json:"game_id"`
	Players       int32  `json:"players"`
	Game_name     string `json:"game_name"`
	Winner_number int32  `json:"winner_number"`
	Queue         string `json:"queue"`
}

var topic = "logs"
var broker1Address = "34.148.239.51:9092"

func (s *server) AddLog(ctx context.Context, in *pb.JuegoRequest) (*pb.RequestReply, error) {
	result := GameResult{}
	if in.GetGameId() == 1 {
		result = gameNumberOne(in)
	} else if in.GetGameId() == 2 {
		result = gameNumberTwo(in)
	} else if in.GetGameId() == 3 {
		result = gameNumberThree(in)
	} else if in.GetGameId() == 4 {
		result = gameNumberFour(in)
	} else if in.GetGameId() == 5 {
		result = gameNumberFive(in)
	}
	// intialize the writer with the broker addresses, and the topic
	p, err := kafka.NewProducer(&kafka.ConfigMap{
		"bootstrap.servers": broker1Address,
		"acks":              "all"})

	if err != nil {
		fmt.Printf("Failed to create producer: %s\n", err)
		os.Exit(1)
	}

	msg, err2 := json.Marshal(result)
	if err2 != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	delivery_chan := make(chan kafka.Event, 10000)
	_ = p.Produce(&kafka.Message{
		TopicPartition: kafka.TopicPartition{Topic: &topic, Partition: kafka.PartitionAny},
		Value:          msg},
		delivery_chan,
	)
	return &pb.RequestReply{Message: "Log Enviado a Kafka"}, nil
}

func main() {
	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterJuegosServer(s, &server{})
	log.Printf("Server listening at %v", lis.Addr())
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}

func gameNumberOne(prueba *pb.JuegoRequest) GameResult {
	resultado := GameResult{}
	resultado.Game_id = prueba.GameId
	resultado.Players = prueba.Players
	resultado.Game_name = "Uno"
	resultado.Winner_number = 3
	resultado.Queue = "Kafka"
	return resultado
}

func gameNumberTwo(prueba *pb.JuegoRequest) GameResult {
	resultado := GameResult{}
	resultado.Game_id = prueba.GameId
	resultado.Players = prueba.Players
	resultado.Game_name = "Dos"
	resultado.Winner_number = 8
	resultado.Queue = "Kafka"
	return resultado
}

func gameNumberThree(prueba *pb.JuegoRequest) GameResult {
	resultado := GameResult{}
	resultado.Game_id = prueba.GameId
	resultado.Players = prueba.Players
	resultado.Game_name = "Tres"
	resultado.Winner_number = 13
	resultado.Queue = "Kafka"
	return resultado
}

func gameNumberFour(prueba *pb.JuegoRequest) GameResult {
	resultado := GameResult{}
	resultado.Game_id = prueba.GameId
	resultado.Players = prueba.Players
	resultado.Game_name = "Cuatro"
	resultado.Winner_number = 43
	resultado.Queue = "Kafka"
	return resultado
}
func gameNumberFive(prueba *pb.JuegoRequest) GameResult {
	resultado := GameResult{}
	resultado.Game_id = prueba.GameId
	resultado.Players = prueba.Players
	resultado.Game_name = "Cinco"
	resultado.Winner_number = 23
	resultado.Queue = "Kafka"
	return resultado
}
