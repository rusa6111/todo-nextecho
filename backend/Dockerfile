FROM golang:1.23-alpine AS development

WORKDIR /app

RUN go install github.com/air-verse/air@latest

COPY go.mod go.sum ./
RUN go mod tidy

COPY . .

CMD ["air"]



FROM --platform=linux/x86_64 golang:1.23-alpine AS production

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod tidy

COPY . .

RUN go build -o main .

EXPOSE 8080
CMD ["./main"]