FROM golang:alpine AS builder

WORKDIR /app

COPY go.mod ./
RUN go mod download

COPY . .

RUN go build -ldflags="-s -w" -o fullcycle .

FROM scratch

COPY --from=builder /app/fullcycle .

CMD ["./fullcycle"]
