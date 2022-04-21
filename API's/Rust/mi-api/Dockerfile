FROM rust:latest

WORKDIR /usr/scr/mi-api
 
COPY . .
 
RUN cargo build
ENV PORT=8080
CMD cargo run 