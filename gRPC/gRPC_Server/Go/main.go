package main

import (
	"context"
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
	Players       int32  `json:"players"`
	Game_id       int32  `json:"game_id"`
	Game_name     string `json:"game_name"`
	Winner_number string `json:"winner_number"`
	Queue         string `json:"queue"`
}

const (
	topic          = "message-log"
	broker1Address = "localhost:9093"
	broker2Address = "localhost:9094"
	broker3Address = "localhost:9095"
)

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

func (s *server) Exec_Games(ctx context.Context, in *pb.JuegoRequest) (GameResult, error) {

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
		"bootstrap.servers": "host1:9092,host2:9092",
		"acks":              "all"})

	if err != nil {
		fmt.Printf("Failed to create producer: %s\n", err)
		os.Exit(1)
	}
	delivery_chan := make(chan kafka.Event, 10000)
	err = p.Produce(&kafka.Message{
		TopicPartition: kafka.TopicPartition{Topic: topic, Partition: kafka.PartitionAny},
		Value:          result},
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
	log.Printf("server listening at %v", lis.Addr())
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}

func gameNumberOne(prueba *pb.JuegoRequest) GameResult {
	resultado := GameResult{}
	resultado.Game_id = prueba.GameId
	resultado.Players = prueba.Players
	resultado.Game_name = "Uno"
	resultado.Winner_number = "3"
	resultado.Queue = "Kafka"
	return resultado
}

func gameNumberTwo(prueba *pb.JuegoRequest) GameResult {
	resultado := GameResult{}
	resultado.Game_id = prueba.GameId
	resultado.Players = prueba.Players
	resultado.Game_name = "Dos"
	resultado.Winner_number = "8"
	resultado.Queue = "Kafka"
	return resultado
}

func gameNumberThree(prueba *pb.JuegoRequest) GameResult {
	resultado := GameResult{}
	resultado.Game_id = prueba.GameId
	resultado.Players = prueba.Players
	resultado.Game_name = "Tres"
	resultado.Winner_number = "13"
	resultado.Queue = "Kafka"
	return resultado
}

func gameNumberFour(prueba *pb.JuegoRequest) GameResult {
	resultado := GameResult{}
	resultado.Game_id = prueba.GameId
	resultado.Players = prueba.Players
	resultado.Game_name = "Cuatro"
	resultado.Winner_number = "43"
	resultado.Queue = "Kafka"
	return resultado
}
func gameNumberFive(prueba *pb.JuegoRequest) GameResult {
	resultado := GameResult{}
	resultado.Game_id = prueba.GameId
	resultado.Players = prueba.Players
	resultado.Game_name = "Cinco"
	resultado.Winner_number = "23"
	resultado.Queue = "Kafka"
	return resultado
}
